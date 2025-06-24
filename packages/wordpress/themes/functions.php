<?php
/**
 * Theme functions for API authentication shortcode
 *
 * @package Profile\Functions
 */

/**
 * ShortCode: API認証リダイレクト用
 * 使用例: [requireApiAuth]
 */
function require_external_php() {
	require ABSPATH . 'extra/cas-auth.php';
}
add_shortcode( 'requireApiAuth', 'require_external_php' );
