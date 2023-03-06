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

require_once __DIR__ . '/includes/admin.php';
\Profile\Admin\init();

require_once __DIR__ . '/includes/issue.php';
\Profile\Issue\init();
