<?php
/** 投稿閲覧画面 */

namespace Profile\Post;

use Ramsey\Uuid\Uuid;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_DEFAULT_CA_SERVER_HOSTNAME;

require_once __DIR__ . '/url.php';
use function Profile\Url\add_page_query;

/** 投稿閲覧画面の初期化 */
function init() {
	\add_action( 'wp_head', '\Profile\Post\cas_script' );
}

/**
 * Script要素
 *
 * @todo <https://docs.originator-profile.org/rfc/link-to-html/#%E5%A4%96%E9%83%A8%E5%8F%82%E7%85%A7> integrity 属性未実装
 */
function cas_script() {
	if ( ! \is_single() ) {
		return;
	}

	$hostname = \get_option( 'profile_default_ca_server_hostname', PROFILE_DEFAULT_CA_SERVER_HOSTNAME );

	if ( empty( $hostname ) ) {
		return;
	}

	if ( ! is_string( $hostname ) ) {
		return;
	}

	$uri  = \get_the_guid();
	$page = \max( 1, \get_query_var( 'page' ) );

	if ( $page > 1 ) {
		$uri = add_page_query( $uri, $page );
	}

	$uuid     = 'urn:uuid:' . Uuid::uuid5( Uuid::NAMESPACE_URL, $uri );
	$endpoint = "https://{$hostname}/cas?id={$uuid}";

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG && 'localhost' === $hostname ) {
		$endpoint = "http://localhost:8080/cas?id={$uuid}";
	}

	echo '<script type="application/cas+json" src="' . \esc_url( $endpoint ) . '"></script>' . PHP_EOL;
}
