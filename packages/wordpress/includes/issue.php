<?php
/** Signed Document Profileの発行 */

namespace Profile\Issue;

use Lcobucci\JWT\Signer\Ecdsa\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Ramsey\Uuid\Uuid;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_PRIVATE_KEY_FILENAME;
use const Profile\Config\PROFILE_SIGN_TYPE;
use const Profile\Config\PROFILE_SIGN_LOCATION;

require_once __DIR__ . '/key.php';
use function Profile\Key\get_jwk;
use function Profile\Key\base64_urlsafe_encode;

require_once __DIR__ . '/class-dp.php';
use Profile\Dp\Dp;

/** 投稿への署名処理の初期化 */
function init() {
	\add_action( 'transition_post_status', '\Profile\Issue\sign_post', 10, 3 );
}

/**
 * 投稿への署名
 *
 * @param string   $new_status New post status.
 * @param string   $old_status Old post status.
 * @param \WP_Post $post Post object.
 */
function sign_post( string $new_status, string $old_status, \WP_Post $post ) {
	if ( 'publish' !== $new_status ) {
		return;
	}

	$content  = \apply_filters( 'the_content', $post->post_content );
	$document = new \DOMDocument();
	$document->loadHTML( "<!DOCTYPE html><meta charset=\"UTF-8\">{$content}" );
	$text = $document->textContent;

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';

		if ( \WP_Filesystem() ) {
			global $wp_filesystem;
			$wp_filesystem->put_contents( \get_temp_dir() . "/profile-test-snapshots/{$post->ID}.snapshot.txt", $text );
		}
	}

	$filename = 'file://' . PROFILE_PRIVATE_KEY_FILENAME;
	$jws      = sign_body( $text, $filename );

	if ( ! $jws ) {
		return;
	}

	$domain_name = \get_option( 'profile_registry_domain_name' );

	if ( empty( $domain_name ) ) {
		return;
	}

	if ( ! is_string( $domain_name ) ) {
		return;
	}

	$url = \get_permalink( $post );

	if ( ! $url ) {
		return;
	}

	$dp  = new Dp(
		issuer: $domain_name,
		subject: Uuid::uuid5( Uuid::NAMESPACE_URL, $post->guid ),
		url: $url,
		jws: $jws,
		title: $post->post_title,
		image: \has_post_thumbnail( $post ) ? \get_the_post_thumbnail_url( $post ) : null,
		description: \has_excerpt( $post ) ? \get_the_excerpt( $post ) : null,
		author: \get_the_author_meta( 'display_name', $post->post_author ),
		date_published: \get_the_date( \DateTimeInterface::RFC3339, $post ),
		date_modified: \get_the_modified_date( \DateTimeInterface::RFC3339, $post ),
	);
	$jwt = issue_dp( $dp, \get_option( 'profile_registry_admin_secret' ), $filename );

	if ( ! $jwt ) {
		return;
	}

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';

		if ( \WP_Filesystem() ) {
			global $wp_filesystem;
			$wp_filesystem->put_contents( \get_temp_dir() . "/profile-test-snapshots/{$post->ID}.snapshot.jwt", $jwt );
		}
	}
}

/**
 * 対象のテキストへの署名 (RFC 7797)
 *
 * @param string $body 対象のテキスト
 * @param string $pkcs8 PEM base64 でエンコードされた PKCS #8 秘密鍵またはそのファイルパス
 * @return string|false 成功した場合はDetached Compact JWS、失敗した場合はfalse
 */
function sign_body( string $body, string $pkcs8 ): string|false {
	$pkey = \openssl_pkey_get_private( $pkcs8 );
	$jwk  = get_jwk( $pkey );

	if ( ! $jwk ) {
		return false;
	}

	$header = array(
		'alg'  => $jwk['alg'],
		'kid'  => $jwk['kid'],
		'b64'  => false,
		'crit' => array( 'b64' ),
	);

	$protected = base64_urlsafe_encode( \json_encode( $header ) );
	$data      = "{$protected}.{$body}";
	$signature = ( new Sha256() )->sign( $data, InMemory::plainText( $pkcs8 ) );
	$jws       = $protected . '..' . base64_urlsafe_encode( $signature );

	return $jws;
}

/**
 * Signed Document Profileの発行
 *
 * @param Dp     $dp Dp
 * @param string $admin_secret レジストリ認証情報
 * @param string $pkcs8 PEM base64 でエンコードされた PKCS #8 秘密鍵またはそのファイルパス
 * @return string|false 成功した場合はSigned Document Profile、失敗した場合はfalse
 */
function issue_dp( Dp $dp, string $admin_secret, string $pkcs8 ): string|false {
	$jwt = $dp->sign( pkcs8: $pkcs8 );

	if ( ! $jwt ) {
		return false;
	}

	/**
	 * カテゴリーの接続あるいは作成
	 *
	 * @param string $website_id ウェブサイトの識別子
	 * @param ?array $category カテゴリー
	 * @remarks
	 * 不要な websiteCategories レコードの削除はおこなわれません
	 * 必要に応じて別途 Prisma Studio あるいは profile-registry publisher:website CLI を使用して削除してください
	 */
	function connect_or_create_categories( string $website_id, ?array $category ): \stdClass|array {
		if ( ! $category ) {
			return new \stdClass();
		}
		$callback = function( $value ) {
			return array(
				'where'  => array(
					'websiteCategoriesWhereUniqueInput' => array(
						'categoryCat'    => $value->cat,
						'categoryCattax' => $value->cattax ?? 1,
						'websiteId'      => $website_id,
					),
				),
				'create' => array(
					'category' => array(
						'connect' => array(
							'cat_cattax' => array(
								cat    => $value->cat,
								cattax => $value->cattax ?? 1,
							),
						),
					),
				),
			);
		};
		return array(
			'connectOrCreate' => array_map( $callback, $category ),
		);
	}

	list( $uuid, ) = \explode( ':', $admin_secret );
	$endpoint      = "https://{$dp->issuer}/admin/publisher/{$uuid}";
	$args          = array(
		'method'  => 'POST',
		'headers' => array(
			'authorization' => 'Basic ' . \sodium_bin2base64( $admin_secret, SODIUM_BASE64_VARIANT_ORIGINAL ),
			'content-type'  => 'application/json',
		),
		'body'    => \wp_json_encode(
			array(
				'input' => array(
					'id'            => $dp->subject,
					'url'           => $dp->url,
					'title'         => $dp->title,
					'image'         => $dp->image,
					'description'   => $dp->description,
					'author'        => $dp->author,
					'categories'    => connect_or_create_categories( $dp->subject, $dp->category ),
					'editor'        => $dp->editor,
					'datePublished' => $dp->date_published,
					'dateModified'  => $dp->date_modified,
					'bodyFormat'    => array( 'connect' => array( 'value' => PROFILE_SIGN_TYPE ) ),
					'location'      => PROFILE_SIGN_LOCATION,
					'proofJws'      => $dp->jws,
				),
				'jwt'   => $jwt,
			)
		),
	);

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG && 'localhost' === $dp->issuer ) {
		$in_docker = \file_exists( '/.dockerenv' );
		if ( $in_docker ) {
			$endpoint = "http://host.docker.internal:8080/admin/publisher/{$uuid}";
		} else {
			$endpoint = "http://localhost:8080/admin/publisher/{$uuid}";
		}
	}

	$res = \wp_remote_request( $endpoint, $args );
	if ( \is_wp_error( $res ) ) {
		return false;
	}

	if ( 200 !== $res['response']['code'] ) {
		$args['method'] = 'PUT';
		$res            = \wp_remote_request( $endpoint, $args );
	}

	if ( \is_wp_error( $res ) || 200 !== $res['response']['code'] ) {
		return false;
	}

	return $jwt;
}

