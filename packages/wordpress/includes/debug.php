<?php
/** Debug */

namespace Profile\Debug;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_DEFAULT_CA_LOG_DIR;

/**
 * Debug function
 *
 * @param string $message The message to log.
 */
function debug( string $message ) {
	$date = gmdate( 'c' );
	// WordPress 全体のデバッグログ
	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		\error_log( $message );
	}
	// プラグイン専用ログ
	if ( \get_option( 'profile_ca_log_option' ) === '1' ) {
		global $wp_filesystem;
		$dir_name = PROFILE_DEFAULT_CA_LOG_DIR;
		$dir      = ABSPATH . "{$dir_name}/";
		if ( ! $wp_filesystem->exists( $dir ) ) {
			if ( ! $wp_filesystem->mkdir( $dir, 0750 ) ) {
				\error_log( "Failed to create directory: {$dir}" );
				return;
			}
		}
		$log_file = "{$dir}ca-manager-debug.log";
		\error_log( "[Date:{$date}] " . $message . PHP_EOL, 3, $log_file );
	}
}
