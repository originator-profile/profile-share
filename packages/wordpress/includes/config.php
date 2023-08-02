<?php
/** 構成 */

namespace Profile\Config;

/** プライベート鍵ファイル */
const PROFILE_PRIVATE_KEY_FILENAME = WP_CONTENT_DIR . '/credentials/profile.key.pem';

/** DP レジストリサーバーのホスト名のデフォルト値 */
const PROFILE_DEFAULT_PROFILE_REGISTRY_SERVER_HOSTNAME = 'dprexpt.originator-profile.org';

/** 検証する対象の型 */
const PROFILE_VERIFICATION_TYPE = 'text';

/** 検証する対象の要素 */
const PROFILE_VERIFICATION_LOCATION = '.wp-block-post-content>*:not(.post-nav-links)';
