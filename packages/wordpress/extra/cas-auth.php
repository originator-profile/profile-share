<?php
/**
 * CA Server Authentication
 *
 * @package Profile\CasAuth
 */

namespace Profile\CasAuth;

// Please specify the ca-manager plugin directory.
const CA_MANAGER_PLUGIN_DIRNAME = 'wordpress-ca-manager';

require_once ABSPATH . 'wp-admin/includes/plugin.php';
// Check if the CA Manager plugin is active.
if ( ! \is_plugin_active( CA_MANAGER_PLUGIN_DIRNAME . '/ca-manager.php' ) ) {
	exit( 'Please activate the CA Manager plugin to use this feature.' );
}

require_once \WP_PLUGIN_DIR . '/' . CA_MANAGER_PLUGIN_DIRNAME . '/includes/class-casapiauthclient.php';
use Profile\CasApiAuthClient\CasApiAuthClient;

// Check if the user is logged in.
if ( ! \is_user_logged_in() ) {
	// Fake 404 error if the user is not logged in.
	header( 'HTTP/1.1 404 Not Found' );
	exit( 'Page not found.' );
}
// Check if the admin secret is set.
$admin_secret = \get_option( 'profile_ca_server_admin_secret', null );
if ( ! $admin_secret ) {
	exit( 'Please configure the CA Manager plugin settings.' );
}

// OIDC Authentication.
$auth = new CasApiAuthClient( $admin_secret );
// Initialize the OIDC client.
if ( ! $auth->init_oidc( $admin_secret ) ) {
	exit( 'Failed to initialize. Please check the CA Manager plugin settings.' );
}

// Authenticate the user.
// phpcs:ignore WordPress.Security.NonceVerification.Recommended
if ( $auth->authenticate() && isset( $_REQUEST['code'] ) ) {
	exit( 'API authentication successful' );
} else {
	exit( 'API authentication failed' );
}
