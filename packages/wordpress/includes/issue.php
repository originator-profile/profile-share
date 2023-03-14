<?php
/** Signed Document Profileの発行 */

namespace Profile\Issue;

/** 投稿への署名処理の初期化 */
function init() {
	\add_action( 'transition_post_status', '\Profile\Issue\sign_post', 10, 3 );
}

/**
 * 投稿への署名
 *
 * @param string   $new_status New post status.
 * @param string   $old_status Old post status.
 * @param \WP_Post $post Post object.
 */
function sign_post( string $new_status, string $old_status, \WP_Post $post ) {
	if ( 'publish' !== $new_status ) {
		return;
	}

	$content  = \apply_filters( 'the_content', $post->post_content );
	$document = new \DOMDocument();
	$document->loadHTML( "<!DOCTYPE html><meta charset=\"UTF-8\">{$content}" );
	$text = $document->textContent;

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';

		if ( \WP_Filesystem() ) {
			global $wp_filesystem;
			$wp_filesystem->put_contents( __DIR__ . "/../tmp/{$post->ID}.snapshot.txt", $text );
		}
	}

	$jws = sign_body( $text );
	$jwt = sign_dp( $jws );
	issue_dp( $jwt );
}

/**
 * 対象のテキストへの署名
 *
 * @todo 実装 #505
 */
function sign_body() {
}

/**
 * DPへの署名
 *
 * @todo 実装 #506
 */
function sign_dp() {
}

/**
 * Signed Document Profileの発行
 *
 * @todo WordPress連携用DP登録APIへリクエストを行い登録する
 */
function issue_dp() {
}
