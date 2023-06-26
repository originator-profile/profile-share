<?php
/** 構成 */

namespace Profile\Config;

/** プライベート鍵ファイル */
const PROFILE_PRIVATE_KEY_FILENAME = WP_CONTENT_DIR . '/credentials/profile.key.pem';

/** デフォルトのレジストリドメイン名 */
const PROFILE_DEFAULT_PROFILE_REGISTRY_DOMAIN_NAME = 'oprdev.originator-profile.org';

/** 署名型 */
const PROFILE_SIGN_TYPE = 'text';

/** 署名対象の要素 */
const PROFILE_SIGN_LOCATION = '.wp-block-post-content>*:not(.post-nav-links)';
