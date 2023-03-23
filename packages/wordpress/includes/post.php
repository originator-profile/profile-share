<?php
/** 投稿閲覧画面 */

namespace Profile\Post;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_DEFAULT_PROFILE_REGISTRY_DOMAIN_NAME;

/** 投稿閲覧画面の初期化 */
function init() {
	\add_action( 'wp_head', '\Profile\Post\profile_link' );
}

/** Link要素 */
function profile_link() {
	if ( ! \is_single() ) {
		return;
	}

	$registry = \get_option( 'profile_registry_domain_name', PROFILE_DEFAULT_PROFILE_REGISTRY_DOMAIN_NAME );

	if ( empty( $registry ) ) {
		return;
	}

	if ( ! is_string( $registry ) ) {
		return;
	}

	$url = \get_permalink();

	if ( ! $url ) {
		return;
	}

	$encoded_url = \rawurlencode( $url );
	$endpoint    = "https://{$registry}/website/{$encoded_url}/profiles";

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG && 'localhost' === $registry ) {
		$endpoint = "http://localhost:8080/website/{$encoded_url}/profiles";
	}

	echo '<link href="' . \esc_html( $endpoint ) . '" rel="alternate" type="application/ld+json">' . PHP_EOL;
}
