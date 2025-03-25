<?php
/** 管理者画面 */

namespace Profile\Admin;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_DEFAULT_CA_SERVER_HOSTNAME;
use const Profile\Config\PROFILE_DEFAULT_CA_TARGET_TYPE;
use const Profile\Config\PROFILE_DEFAULT_CA_TARGET_CSS_SELECTOR;
use const Profile\Config\PROFILE_DEFAULT_CA_TARGET_HTML;

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
	\register_setting( 'ca-manager', 'profile_ca_server_hostname', array( 'default' => PROFILE_DEFAULT_CA_SERVER_HOSTNAME ) );
	\register_setting( 'ca-manager', 'profile_ca_issuer_id' );
	\register_setting( 'ca-manager', 'profile_ca_server_admin_secret' );
	\register_setting( 'ca-manager', 'profile_ca_target_type', array( 'default' => PROFILE_DEFAULT_CA_TARGET_TYPE ) );
	\register_setting( 'ca-manager', 'profile_ca_target_css_selector', array( 'default' => PROFILE_DEFAULT_CA_TARGET_CSS_SELECTOR ) );
	\register_setting( 'ca-manager', 'profile_ca_target_html', array( 'default' => PROFILE_DEFAULT_CA_TARGET_HTML ) );
	\add_settings_section( 'profile_settings', '設定', '\Profile\Admin\profile_settings_section', 'ca-manager' );
	\add_settings_field( 'profile_ca_issuer_id', 'CA issuer\'s Originator Profile ID', '\Profile\Admin\profile_ca_issuer_id_field', 'ca-manager', 'profile_settings' );
	\add_settings_field( 'profile_ca_server_hostname', 'CAサーバーホスト名', '\Profile\Admin\profile_ca_server_hostname_field', 'ca-manager', 'profile_settings' );
	\add_settings_field( 'profile_ca_server_admin_secret', '認証情報', '\Profile\Admin\profile_ca_server_admin_secret_field', 'ca-manager', 'profile_settings' );
	\add_settings_field( 'profile_ca_target_type', '検証対象の種別', '\Profile\Admin\profile_ca_target_type_field', 'ca-manager', 'profile_settings' );
	\add_settings_field( 'profile_ca_target_css_selector', '検証対象要素CSSセレクター', '\Profile\Admin\profile_ca_target_css_selector_field', 'ca-manager', 'profile_settings' );
	\add_settings_field( 'profile_ca_target_html', '検証対象要素の存在するHTML', '\Profile\Admin\profile_ca_target_html_field', 'ca-manager', 'profile_settings' );
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
		<p>これらの設定が完了しないと Content Attestation (CA) の発行機能は正しく動作しません。正しく設定が反映されると、それ以降に更新した投稿と新規投稿は自動的にCAサーバーに送信されます。</p>
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
			style="width: 320px;"
		>
	<?php
}

/** CAサーバーホスト名フィールド */
function profile_ca_server_hostname_field() {
	?>
		<input
			name="profile_ca_server_hostname"
			value="<?php echo \esc_attr( \get_option( 'profile_ca_server_hostname' ) ); ?>"
			title="有効なドメイン名を入力してください (例: dprexpt.originator-profile.org)"
			placeholder="<?php echo \esc_attr( PROFILE_DEFAULT_CA_SERVER_HOSTNAME ); ?>"
			required
			style="width: 320px;"
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
			style="width: 320px;"
		>
	<?php
}

/** 検証対象の種別フィールド */
function profile_ca_target_type_field() {
	?>
		<input
			name="profile_ca_target_type"
			value="<?php echo \esc_attr( \get_option( 'profile_ca_target_type' ) ); ?>"
			list="target_integrity_type"
			title="検証対象の種別を入力してください (例: TextTargetIntegrity)"
			placeholder="<?php echo \esc_attr( PROFILE_DEFAULT_CA_TARGET_TYPE ); ?>"
			required
			style="width: 320px;"
		>
		<datalist id="target_integrity_type">
			<option>HTMLTargetIntegrity</option>
			<option>TextTargetIntegrity</option>
			<option>VisibleTextTargetIntegrity</option>
		</datalist>
	<?php
}

/** 検証対象要素CSSセレクターフィールド */
function profile_ca_target_css_selector_field() {
	?>
		<input
			name="profile_ca_target_css_selector"
			value="<?php echo \esc_attr( \get_option( 'profile_ca_target_css_selector' ) ); ?>"
			title="CSS セレクターを入力してください"
			placeholder="<?php echo \esc_attr( PROFILE_DEFAULT_CA_TARGET_CSS_SELECTOR ); ?>"
			required
			style="width: 320px;"
		>
	<?php
}

/** 検証対象要素の存在するHTML */
function profile_ca_target_html_field() {
	?>
		<textarea
			name="profile_ca_target_html"
			title="%CONTENT% → WordPress post content after applying apply_filters()"
			style="font-family: monospace;"
			rows="6"
		><?php echo \esc_html( \get_option( 'profile_ca_target_html' ) ); ?></textarea>
	<?php
}
