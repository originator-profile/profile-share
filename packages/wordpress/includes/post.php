<?php
/** 投稿閲覧画面 */

namespace Profile\Post;

if ( ! function_exists( 'WP_Filesystem' ) ) {
	require_once ABSPATH . 'wp-admin/includes/file.php';
}
WP_Filesystem();

require_once __DIR__ . '/debug.php';
use function Profile\Debug\debug;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_DEFAULT_CA_EXTERNAL_DIR;

/** 投稿閲覧画面の初期化 */
function init() {
	\add_action( 'wp_head', '\Profile\Post\cas_script' );
	\add_filter( 'render_block_core/image', '\Profile\Post\block_image', 10, 2 );
}

/**
 * Script要素
 */
function cas_script() {
	if ( ! \is_singular() ) {
		debug( 'Not a singular post, skipping CAS script injection' );
		return;
	}

	$post_id = \get_the_ID();
	$page    = \max( 1, \get_query_var( 'page' ) );
	$cas     = \get_post_meta( $post_id, '_profile_post_cas', true );
	$cas     = is_array( $cas ) ? $cas[ $page - 1 ] : $cas;

	if ( ! $cas ) {
		debug( "No CAS found for post ID: {$post_id}, page: {$page}" );
		return;
	}

	$embedded_or_external = \get_option( 'profile_ca_embedded_or_external' );

	switch ( $embedded_or_external ) {
		case 'embedded':
			echo '<script type="application/cas+json">' . \wp_json_encode( $cas ) . '</script>' . PHP_EOL;
			break;
		case 'external':
			global $wp_filesystem;
			$dir_name = PROFILE_DEFAULT_CA_EXTERNAL_DIR;
			$dir      = ABSPATH . "{$dir_name}/";
			if ( ! $wp_filesystem->exists( $dir ) ) {
				debug( "Directory does not exist, attempting to create: {$dir}" );
				if ( ! $wp_filesystem->mkdir( $dir ) ) {
					debug( "Failed to create directory: {$dir}" );
					return;
				}
			}
			$filename     = "{$post_id}_cas.json";
			$existing_cas = $wp_filesystem->get_contents( "{$dir}{$filename}" );
			if ( \wp_json_encode( $cas ) !== $existing_cas ) {
				$write_result = $wp_filesystem->put_contents( "{$dir}{$filename}", \wp_json_encode( $cas ), FS_CHMOD_FILE );
				if ( ! $write_result ) {
					debug( "Failed to write JSON file: {$filename}" );
					return;
				}
			}

			$url      = \home_url();
			$endpoint = "{$url}/{$dir_name}/{$filename}";

			echo '<script src="' . \esc_url( $endpoint ) . '" type="application/cas+json"></script>' . PHP_EOL;
			break;
	}
}

/**
 * 画像要素

 * @param string $content ブロックコンテンツ
 * @param array  $block   ブロック
 * @return string ブロックコンテンツ
 */
function block_image( string $content, array $block ): string {
	$id = $block['attrs']['id'] ?? null;

	if ( ! $id ) {
		debug( 'Image block has no ID attribute, skipping integrity injection' );
		return $content;
	}

	$integrity = \get_post_meta( $id, '_profile_attachment_integrity', true );
	$integrity = \is_array( $integrity ) ? \implode( ' ', $integrity ) : null;

	if ( ! $integrity ) {
		debug( "No Integrity metadata found for attachment ID: {$id}" );
		return $content;
	}

	return \str_replace( '<img ', '<img integrity="' . \esc_attr( $integrity ) . '" ', $content );
}
