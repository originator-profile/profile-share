<?php
/** Log */

namespace Profile\Log;

/**
 * ログファイルの末尾を効率的に取得する関数
 *
 * @param string $file Path to the log file.
 * @param int    $lines Number of lines to retrieve from the end of the file.
 * @return array The last N lines of the log file as an array.
 */
function get_last_lines( $file, $lines = 25 ) {
	$f = new \SplFileObject( $file, 'r' );
	$f->seek( PHP_INT_MAX );
	$pos              = $f->key();
	$last_lines       = array();
	$last_lines_count = count( $last_lines );
	while ( $pos >= 0 && $last_lines_count < $lines ) {
		$f->seek( $pos-- );
		$line = trim( $f->current() );
		if ( '' !== $line ) {
			array_unshift( $last_lines, $line );
			++$last_lines_count;
		}
	}
	return array_reverse( $last_lines );
}
