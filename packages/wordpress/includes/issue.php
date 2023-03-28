<?php
/** Signed Document Profileの発行 */

namespace Profile\Issue;

use Lcobucci\JWT\Token\Builder;
use Lcobucci\JWT\Encoding\ChainedFormatter;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Signer\Ecdsa\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_PRIVATE_KEY_FILENAME;
use const Profile\Config\PROFILE_SIGN_TYPE;
use const Profile\Config\PROFILE_SIGN_LOCATION;

require_once __DIR__ . '/key.php';
use function Profile\Key\get_jwk;
use function Profile\Key\base64_urlsafe_encode;

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

	$url = \get_permalink( $post->ID );

	if ( ! $url ) {
		return;
	}

	$jwt = issue_dp( $domain_name, \get_option( 'profile_registry_admin_secret' ), $url, $jws, $filename );

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
 * @param string $domain_name レジストリドメイン名
 * @param string $admin_secret レジストリ認証情報
 * @param string $url 投稿のパーマリンクのリンク
 * @param string $jws 対象のテキストへの署名
 * @param string $pkcs8 PEM base64 でエンコードされた PKCS #8 秘密鍵またはそのファイルパス
 * @return string|false 成功した場合はSigned Document Profile、失敗した場合はfalse
 */
function issue_dp( string $domain_name, string $admin_secret, string $url, string $jws, string $pkcs8 ): string|false {
	$jwt           = sign_dp( $domain_name, $url, $jws, $pkcs8 );
	list( $uuid, ) = \explode( ':', $admin_secret );
	$endpoint      = "https://{$domain_name}/admin/publisher/{$uuid}";
	$args          = array(
		'method'  => 'POST',
		'headers' => array(
			'authorization' => 'Basic ' . \sodium_bin2base64( $admin_secret, SODIUM_BASE64_VARIANT_ORIGINAL ),
			'content-type'  => 'application/json',
		),
		'body'    => \wp_json_encode(
			array(
				'input' => array(
					'url'        => $url,
					'bodyFormat' => array( 'connect' => array( 'value' => PROFILE_SIGN_TYPE ) ),
					'location'   => PROFILE_SIGN_LOCATION,
					'proofJws'   => $jws,
				),
				'jwt'   => $jwt,
			)
		),
	);

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG && 'localhost' === $domain_name ) {
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

/**
 * DPへの署名
 *
 * @param string $domain_name レジストリドメイン名
 * @param string $url 投稿のパーマリンクのリンク
 * @param string $jws 対象のテキストへの署名
 * @param string $pkcs8 PEM base64 でエンコードされた PKCS #8 秘密鍵またはそのファイルパス
 * @return string Signed DP
 */
function sign_dp( string $domain_name, string $url, string $jws, string $pkcs8 ): string {
	$pkey = \openssl_pkey_get_private( $pkcs8 );
	$jwk  = get_jwk( $pkey );

	if ( ! $jwk ) {
		return false;
	}

	$dp = array(
		'type'      => 'dp',
		'issuedAt'  => \gmdate( 'c' ),
		'expiredAt' => \gmdate( 'c', \strtotime( '+ 1 year' ) ),
		'issuer'    => $domain_name,
		'subject'   => $url,
		'item'      => array(
			array(
				'type' => 'website',
				'url'  => $url,
			),
			array(
				'type'     => PROFILE_SIGN_TYPE,
				'url'      => $url,
				'location' => PROFILE_SIGN_LOCATION,
				'proof'    => array( 'jws' => $jws ),
			),
		),
	);

	$builder = (
			new Builder( new JoseEncoder(), ChainedFormatter::withUnixTimestampDates() )
		)
			->withHeader( 'alg', $jwk['alg'] )
			->withHeader( 'kid', $jwk['kid'] )
			->issuedBy( $dp['issuer'] )
			->relatedTo( $dp['subject'] )
			->issuedAt(
				( new \DateTimeImmutable() )
				->setTimestamp( \strtotime( $dp['issuedAt'] ) )
			)
			->expiresAt(
				( new \DateTimeImmutable() )
				->setTimestamp( \strtotime( $dp['expiredAt'] ) )
			)
			->withClaim( 'https://opr.webdino.org/jwt/claims/dp', array( 'item' => $dp['item'] ) );

	$jwt = $builder->getToken( new Sha256(), InMemory::plainText( $pkcs8 ) );

	return $jwt->toString();
}
