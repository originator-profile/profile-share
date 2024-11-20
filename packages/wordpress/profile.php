<?php
/**
 * Profile Plugin
 *
 * Plugin Name: Profile
 * Version: 0.1.0-beta.1
 * License: MIT
 *
 * @package Profile
 */

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

require_once __DIR__ . '/includes/admin.php';
\Profile\Admin\init();

require_once __DIR__ . '/includes/issue.php';
\Profile\Issue\init();

require_once __DIR__ . '/includes/key.php';
\Profile\Key\init();

require_once __DIR__ . '/includes/post.php';
\Profile\Post\init();
