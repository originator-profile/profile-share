<?php
/** 管理者画面 */

namespace Profile\Admin;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_PRIVATE_KEY_FILENAME;
use const Profile\Config\PROFILE_DEFAULT_PROFILE_REGISTRY_DOMAIN_NAME;

require_once __DIR__ . '/key.php';
use function Profile\Key\get_jwk_from_file;

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
		'profile_registry_domain_name',
		array(
			'default' => PROFILE_DEFAULT_PROFILE_REGISTRY_DOMAIN_NAME,
		)
	);
	\register_setting( 'profile', 'profile_registry_admin_secret' );
}

/** 設定画面 */
function settings_page() {
	?>
		<h1><?php \esc_html_e( 'Profile', 'profile' ); ?></h1>
		<h2><?php \esc_html_e( '設定', 'settings' ); ?></h2>
		<form method="post" action="options.php">
			<?php \settings_fields( 'profile' ); ?>
			<fieldset>
				<label><?php \esc_html_e( 'レジストリドメイン名', 'registry-domain-name' ); ?>
					<input name="profile_registry_domain_name" required value="<?php echo \esc_html( \get_option( 'profile_registry_domain_name' ) ); ?>">
				</label>
			</fieldset>
			<fieldset>
				<label><?php \esc_html_e( '認証情報', 'registry-admin-secret' ); ?>
					<input name="profile_registry_admin_secret" type="password" autocomplete="off" required value="<?php echo \esc_html( \get_option( 'profile_registry_admin_secret' ) ); ?>">
				</label>
			</fieldset>
			<?php \submit_button(); ?>
		</form>
		<h2><?php \esc_html_e( '構成', 'configuration' ); ?></h2>
		<p>
			<dl>
				<dt><?php \esc_html_e( 'プライベート鍵ファイル', 'private-key-filename' ); ?></dt>
				<dd><?php echo \esc_html( PROFILE_PRIVATE_KEY_FILENAME ); ?></dd>
				<dt><?php \esc_html_e( 'JWK', 'jwk' ); ?></dt>
				<dd><?php echo \esc_html( \wp_json_encode( get_jwk_from_file() ) ); ?></dd>
			</dl>
		</p>
	<?php
}
