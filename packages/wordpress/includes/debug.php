<?php
/** Debug */

namespace Profile\Debug;

/**
 * Debug function
 *
 * @param string $message The message to log.
 */
function debug( string $message ) {
	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		\error_log( $message );
	}
}
