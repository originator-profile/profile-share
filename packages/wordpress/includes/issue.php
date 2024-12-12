<?php
/** Content Attestation の発行 */

namespace Profile\Issue;

use Ramsey\Uuid\Uuid;

require_once __DIR__ . '/class-uca.php';
use Profile\Uca\Uca;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_DEFAULT_CA_SERVER_HOSTNAME;

require_once __DIR__ . '/url.php';
use function Profile\Url\add_page_query;

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

	$admin_secret = \get_option( 'profile_ca_server_admin_secret' );
	$hostname     = \get_option( 'profile_default_ca_server_hostname', PROFILE_DEFAULT_CA_SERVER_HOSTNAME );
	$issuer_id    = \get_option( 'profile_ca_issuer_id', 'dns:' . $hostname );
	$endpoint     = "https://{$hostname}/ca";

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG && 'localhost' === $hostname ) {
		$in_docker = \file_exists( '/.dockerenv' );
		if ( $in_docker ) {
			$endpoint = 'http://host.docker.internal:8080/ca';
		} else {
			$endpoint = 'http://localhost:8080/ca';
		}
	}

	$uca_list = create_uca_list( $post, $issuer_id );

	foreach ( $uca_list as $page => $uca ) {
		++$page;

		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';

			if ( \WP_Filesystem() ) {
				global $wp_filesystem;

				$wp_filesystem->put_contents( \get_temp_dir() . "/profile-test-snapshots/{$post->ID}.{$page}.snapshot.json", $uca->to_json() );
			}
		}

		issue_ca( $uca, $endpoint, $admin_secret );
	}
}

/**
 * 未署名 Content Attestation の一覧の作成
 *
 * @param \WP_Post $post Post object.
 * @param string   $issuer_id CA 発行者 ID
 * @return list<Uca> 未署名 Content Attestation の一覧
 */
function create_uca_list( \WP_Post $post, string $issuer_id ): array {
	global $wp_rewrite;

	/**
	 * 未署名 Content Attestation の一覧
	 *
	 * @var list<Uca>
	 */
	$uca_list = array();

	$postdata = \generate_postdata( $post );

	if ( ! $postdata ) {
		return $uca_list;
	}

	$pages = $postdata['pages'];

	foreach ( $pages as $page => $content ) {
		++$page;

		$content = \apply_filters( 'the_content', $content );
		$html    = content_to_html( $content );

		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';

			if ( \WP_Filesystem() ) {
				global $wp_filesystem;
				$wp_filesystem->put_contents( \get_temp_dir() . "/profile-test-snapshots/{$post->ID}.{$page}.snapshot.html", $html );
			}
		}

		$uri       = $post->guid;
		$permalink = \get_permalink( $post );

		if ( $page > 1 ) {
			$uri = add_page_query( $uri, $page );

			// ページのパーマリンクの形式は設定によって異なる.
			if ( $wp_rewrite->using_permalinks() ) {
				$permalink .= $wp_rewrite->use_trailing_slashes ? '' : '/';
				$permalink .= \user_trailingslashit( $page );
			} else {
				$permalink = add_page_query( $permalink, $page );
			}
		}

		$uuid   = 'urn:uuid:' . Uuid::uuid5( Uuid::NAMESPACE_URL, $uri );
		$locale = \str_replace( '_', '-', \get_locale() );

		$uca = new Uca(
			issuer: $issuer_id,
			subject: $uuid,
			url: $permalink,
			locale: $locale,
			html: $html,
			headline: $post->post_title,
			image: \has_post_thumbnail( $post ) ? \get_the_post_thumbnail_url( $post ) : null,
			description: \has_excerpt( $post ) ? \get_the_excerpt( $post ) : null,
			author: \get_the_author_meta( 'display_name', $post->post_author ),
			date_published: \get_the_date( \DateTimeInterface::RFC3339, $post ),
			date_modified: \get_the_modified_date( \DateTimeInterface::RFC3339, $post ),
		);

		\array_push( $uca_list, $uca );
	}

	return $uca_list;
}

/**
 * ページの内容からHTMLへの変換
 *
 * @param string $content ページの内容
 * @return string HTML
 */
function content_to_html( string $content ): string {
	return <<<EOD
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body class="wp-block-post-content">{$content}</body>
</html>
EOD;
}

/**
 * Content Attestation の発行
 *
 * @param Uca    $uca 未署名 Content Attestation オブジェクト
 * @param string $endpoint Content Attestation サーバー CA 登録・更新エンドポイント
 * @param string $admin_secret Content Attestation サーバー認証情報
 * @return mixed 成功した場合は Content Attestation Set、失敗した場合は false
 */
function issue_ca( Uca $uca, string $endpoint, string $admin_secret ): mixed {
	$args = array(
		'method'  => 'POST',
		'headers' => array(
			'authorization' => 'Basic ' . \sodium_bin2base64( $admin_secret, SODIUM_BASE64_VARIANT_ORIGINAL ),
			'content-type'  => 'application/json',
		),
		'body'    => $uca->to_json(),
	);

	$res = \wp_remote_request( $endpoint, $args );

	if ( \is_wp_error( $res ) ) {
		return false;
	}

	if ( 200 !== $res['response']['code'] ) {
		return false;
	}

	return \json_decode( $res['body'], true );
}
