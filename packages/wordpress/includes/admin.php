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
	\add_options_page( 'CA Manager', 'CA Manager', 'manage_options', 'ca-manager', '\Profile\Admin\settings_page' );
}

/** 設定項目の追加 */
function register_settings() {
	\register_setting( 'ca-manager', 'profile_default_ca_server_hostname', array( 'default' => PROFILE_DEFAULT_CA_SERVER_HOSTNAME ) );
	\register_setting( 'ca-manager', 'profile_ca_issuer_id' );
	\register_setting( 'ca-manager', 'profile_ca_server_admin_secret' );
	\add_settings_section( 'profile_settings', '設定', '\Profile\Admin\profile_settings_section', 'ca-manager' );
	\add_settings_field( 'profile_ca_issuer_id', 'CA issuer\'s Originator Profile ID', '\Profile\Admin\profile_ca_issuer_id_field', 'ca-manager', 'profile_settings' );
	\add_settings_field( 'profile_default_ca_server_hostname', 'CAサーバーホスト名', '\Profile\Admin\profile_ca_server_hostname_field', 'ca-manager', 'profile_settings' );
	\add_settings_field( 'profile_ca_server_admin_secret', '認証情報', '\Profile\Admin\profile_ca_server_admin_secret_field', 'ca-manager', 'profile_settings' );
}

/** 設定画面 */
function settings_page() {
	?>
		<div class="wrap">
			<h1>CA Manager</h1>
			<form method="post" action="options.php">
				<?php \settings_fields( 'ca-manager' ); ?>
				<?php \do_settings_sections( 'ca-manager' ); ?>
				<?php \submit_button(); ?>
			</form>
		</div>
	<?php
}

/** 設定セクション */
function profile_settings_section() {
	?>
		<p>これらの設定が完了しないと Content Attestation (CA) の発行機能は正しく動作しません。正しく設定が反映されると、それ以降の投稿は自動的にCAサーバーに送信されます。</p>
	<?php
}

/** CA issuer's OP IDフィールド */
function profile_ca_issuer_id_field() {
	?>
		<input
			name="profile_ca_issuer_id"
			value="<?php echo \esc_attr( \get_option( 'profile_ca_issuer_id' ) ); ?>"
			title="自身のOriginator Profile IDを入力してください (例: dns:media.example.com)"
			placeholder="dns:media.example.com"
			required
			style="width: 300px;"
		>
	<?php
}

/** CAサーバーホスト名フィールド */
function profile_ca_server_hostname_field() {
	?>
		<input
			name="profile_default_ca_server_hostname"
			value="<?php echo \esc_attr( \get_option( 'profile_default_ca_server_hostname' ) ); ?>"
			title="有効なドメイン名を入力してください (例: dprexpt.originator-profile.org)"
			placeholder="dprexpt.originator-profile.org"
			required
			style="width: 300px;"
		>
	<?php
}

/** CAサーバー認証情報フィールド */
function profile_ca_server_admin_secret_field() {
	?>
		<input
			name="profile_ca_server_admin_secret"
			value="<?php echo \esc_attr( \get_option( 'profile_ca_server_admin_secret' ) ); ?>"
			title="Content Attestation サーバーへのアクセスに必要な認証情報を入力してください"
			type="password"
			autocomplete="off"
			required
			style="width: 300px;"
		>
	<?php
}
