<?php
/** 投稿閲覧画面 */

namespace Profile\Post;

use Ramsey\Uuid\Uuid;

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

	$guid     = \get_the_guid();
	$id       = Uuid::uuid5( Uuid::NAMESPACE_URL, $guid );
	$endpoint = "https://{$registry}/website/{$id}/profiles";

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG && 'localhost' === $registry ) {
		$endpoint = "http://localhost:8080/website/{$id}/profiles";
	}

	echo '<link href="' . \esc_html( $endpoint ) . '" rel="alternate" type="application/ld+json">' . PHP_EOL;
}
