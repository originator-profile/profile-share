<?php
/**
 * CA Manager
 *
 * Plugin Name: CA Manager (Originator Profile)
 * Description: WordPress での記事の公開時の Content Attestation (CA) の発行に役立つプラグインです。
 * Version: 0.2.0-beta.0
 * Author: Originator Profile Collaborative Innovation Partnership
 * Author URI: https://originator-profile.org/
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

require_once __DIR__ . '/includes/post.php';
\Profile\Post\init();
