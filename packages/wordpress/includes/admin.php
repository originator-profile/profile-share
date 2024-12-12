<?php
/** 管理者画面 */

namespace Profile\Admin;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_DEFAULT_CA_SERVER_HOSTNAME;

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
	\register_setting(
		'profile',
		'profile_default_ca_server_hostname',
		array(
			'default' => PROFILE_DEFAULT_CA_SERVER_HOSTNAME,
		)
	);
	\register_setting(
		'profile',
		'profile_ca_issuer_id',
		array(
			'default' => 'dns:' . \get_option( 'profile_default_ca_server_hostname' ),
		)
	);
	\register_setting( 'profile', 'profile_ca_server_admin_secret' );
}

/** 設定画面 */
function settings_page() {
	?>
		<h1><?php \esc_html_e( 'Profile', 'profile' ); ?></h1>
		<h2><?php \esc_html_e( '設定', 'settings' ); ?></h2>
		<form method="post" action="options.php">
			<?php \settings_fields( 'profile' ); ?>
			<fieldset>
				<label><?php \esc_html_e( 'Originator Profile ID', 'ca-issuer-id' ); ?>
					<input name="profile_ca_issuer_id" required value="<?php echo \esc_html( \get_option( 'profile_ca_issuer_id' ) ); ?>">
				</label>
			</fieldset>
			<fieldset>
				<label><?php \esc_html_e( 'Content Attestation サーバーホスト名', 'ca-server-hostname' ); ?>
					<input name="profile_default_ca_server_hostname" required value="<?php echo \esc_html( \get_option( 'profile_default_ca_server_hostname' ) ); ?>">
				</label>
			</fieldset>
			<fieldset>
				<label><?php \esc_html_e( '認証情報', 'ca-server-admin-secret' ); ?>
					<input name="profile_ca_server_admin_secret" type="password" autocomplete="off" required value="<?php echo \esc_html( \get_option( 'profile_ca_server_admin_secret' ) ); ?>">
				</label>
			</fieldset>
			<?php \submit_button(); ?>
		</form>
	<?php
}
