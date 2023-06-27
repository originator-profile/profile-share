<?php
/** URLに関するユーティリティ */

namespace Profile\Url;

/**
 * 末尾にクエリーを加えたURLを得る関数
 *
 * @param string $base_url 元のURL (フラグメントを含まない形式のURLを与えてください)
 * @param string $query_key URLクエリーのキー (エンコード済みの文字列を与えてください)
 * @param string $query_value URLクエリーの値 (エンコード済みの文字列を与えてください)
 * @return string 末尾にクエリーを加えたURL
 */
function add_query( string $base_url, string $query_key, string $query_value ): string {
	return $base_url . ( \wp_parse_url( $base_url, \PHP_URL_QUERY ) ? '&' : '?' ) . "{$query_key}={$query_value}";
}

/**
 * 末尾にpageクエリーを加えたURLを得る関数
 *
 * @param string $base_url 元のURL (フラグメントを含まない形式のURLを与えてください)
 * @param int    $page URLクエリーのpageの値
 * @return string 末尾にpageクエリーを加えたURL
 */
function add_page_query( string $base_url, int $page ): string {
	return add_query( $base_url, 'page', $page );
}
