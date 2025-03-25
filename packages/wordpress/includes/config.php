<?php
/** 構成 */

namespace Profile\Config;

/** Content Attestation サーバーのホスト名の設定の初期値 */
const PROFILE_DEFAULT_CA_SERVER_HOSTNAME = 'dprexpt.originator-profile.org';

/** 検証対象の種別の初期値 */
const PROFILE_DEFAULT_CA_TARGET_TYPE = 'TextTargetIntegrity';

/** 検証対象要素 CSS セレクターの初期値 */
const PROFILE_DEFAULT_CA_TARGET_CSS_SELECTOR = '.wp-block-post-content>*:not(.post-nav-links)';

/** 検証対象要素の存在する HTML の初期値 (%CONTENT% → WordPress post content after applying apply_filters()) */
const PROFILE_DEFAULT_CA_TARGET_HTML = <<<'EOD'
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body class="wp-block-post-content">%CONTENT%</body>
</html>
EOD;
