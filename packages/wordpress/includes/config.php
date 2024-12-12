<?php
/** 構成 */

namespace Profile\Config;

/** Content Attestation サーバーのホスト名の設定の初期値 */
const PROFILE_DEFAULT_CA_SERVER_HOSTNAME = 'dprexpt.originator-profile.org';

/** 検証する対象の型 */
const PROFILE_CA_TARGET_TYPE = 'TextTargetIntegrity';

/** 検証する対象の要素 */
const PROFILE_CA_TARGET_CSS_SELECTOR = '.wp-block-post-content>*:not(.post-nav-links)';
