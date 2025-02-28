<?php
/** 投稿閲覧画面 */

namespace Profile\Post;

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
		return;
	}

	$post_id = \get_the_ID();
	$page    = \max( 1, \get_query_var( 'page' ) );
	$cas     = \get_post_meta( $post_id, '_profile_post_cas', true );
	$cas     = is_array( $cas ) ? $cas[ $page - 1 ] : $cas;

	if ( ! $cas ) {
		return;
	}

	echo '<script type="application/cas+json">' . \wp_json_encode( $cas ) . '</script>' . PHP_EOL;
}

/**
 * 画像要素

 * @param string $content ブロックコンテンツ
 * @param array  $block   ブロック
 * @return string ブロックコンテンツ
 */
function block_image( string $content, array $block ): string {
	$id   = $block['attrs']['id'] ?? null;
	$size = $block['attrs']['sizeSlug'] ?? null;

	if ( ! $id ) {
		return $content;
	}

	$integrity = \get_post_meta( $id, '_profile_attachment_integrity', true );
	$integrity = is_array( $integrity ) ? $integrity[ $size ] : null;

	if ( ! $integrity ) {
		return $content;
	}

	return \str_replace( '<img ', '<img integrity="' . \esc_attr( $integrity ) . '" ', $content );
}
