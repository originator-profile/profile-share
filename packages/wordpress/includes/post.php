<?php
/** 投稿閲覧画面 */

namespace Profile\Post;

/** 投稿閲覧画面の初期化 */
function init() {
	\add_action( 'wp_head', '\Profile\Post\cas_script' );
}

/**
 * Script要素
 *
 * @todo <https://docs.originator-profile.org/rfc/link-to-html/#%E5%A4%96%E9%83%A8%E5%8F%82%E7%85%A7> integrity 属性未実装
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
