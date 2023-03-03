<?php
/**
 * Profile Plugin
 *
 * Plugin Name: Profile
 * Version: 0.0.0
 * License: MIT
 *
 * @package Profile
 */

declare(strict_types=1);

/**
 * 例
 *
 * @todo #228
 */
function example(): void {
	$messages = array(
		'海は昼眠る、夜も眠る。',
		'ごうごう、いびきをかいて眠る。',
	);
	echo esc_html( $messages[ array_rand( $messages ) ] );
}

add_action( 'admin_notices', 'example' );
