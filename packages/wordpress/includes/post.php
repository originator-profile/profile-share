<?php
/** 投稿閲覧画面 */

namespace Profile\Post;

use Ramsey\Uuid\Uuid;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_DEFAULT_PROFILE_REGISTRY_SERVER_HOSTNAME;

require_once __DIR__ . '/url.php';
use function Profile\Url\add_page_query;

/** 投稿閲覧画面の初期化 */
function init() {
	\add_action( 'wp_head', '\Profile\Post\profile_link' );
}

/** Link要素 */
function profile_link() {
	if ( ! \is_single() ) {
		return;
	}

	$hostname = \get_option( 'profile_registry_server_hostname', PROFILE_DEFAULT_PROFILE_REGISTRY_SERVER_HOSTNAME );

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

	$uuid     = Uuid::uuid5( Uuid::NAMESPACE_URL, $uri );
	$endpoint = "https://{$hostname}/website/{$uuid}/profiles";

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG && 'localhost' === $hostname ) {
		$endpoint = "http://localhost:8080/website/{$uuid}/profiles";
	}

	echo '<link href="' . \esc_html( $endpoint ) . '" rel="alternate" type="application/ld+json">' . PHP_EOL;
}
