<?php
/** 管理者画面 */

namespace Profile\Admin;

/** 管理者画面の初期化 */
function init() {
	\add_action( 'admin_menu', '\Profile\Admin\add_options_page' );
	\add_action( 'admin_init', '\Profile\Admin\register_settings' );
}

/** 設定画面の追加 */
function add_options_page() {
	\add_options_page(
		'Profile',
		'Profile',
		'manage_options',
		'profile',
		'\Profile\Admin\settings_page'
	);
}

/** 設定項目の追加 */
function register_settings() {
}

/** 設定画面 */
function settings_page() {
	?>
		<h1><?php \esc_html_e( 'Profile', 'profile' ); ?></h1>
	<?php
}
