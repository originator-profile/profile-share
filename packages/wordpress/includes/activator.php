<?php
/** プラグイン有効化時の処理を定義するファイル */

namespace Profile\Activator;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_DEFAULT_CA_LOG_DIR;

require_once __DIR__ . '/debug.php';
use function Profile\Debug\debug;

/**
 * プラグイン有効化時にログファイル配置の環境準備を行う関数
 */
function ca_manager_activate() {
	global $wp_filesystem;
	if ( ! $wp_filesystem ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		WP_Filesystem();
	}
	$dir_name = PROFILE_DEFAULT_CA_LOG_DIR;
	$dir      = trailingslashit( WP_CONTENT_DIR . '/' . $dir_name );
	if ( ! $wp_filesystem->exists( $dir ) ) {
		if ( ! $wp_filesystem->mkdir( $dir, 0750 ) ) {
			debug( "Failed to create directory: {$dir}" );
			return;
		}
	}

	// index.php
	$index_file = $dir . 'index.php';
	if ( ! $wp_filesystem->exists( $index_file ) ) {
		$wp_filesystem->put_contents( $index_file, "<?php\n// ダミーファイル\n" );
	}

	// .htaccess
	$htaccess_file = $dir . '.htaccess';
	if ( ! $wp_filesystem->exists( $htaccess_file ) ) {
		$rules = "<FilesMatch \"\.(log|txt)$\">\n  Require all denied\n</FilesMatch>\n";
		$wp_filesystem->put_contents( $htaccess_file, $rules );
	}
}
