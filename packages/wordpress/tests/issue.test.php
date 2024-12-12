<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

const WP_CONTENT_DIR = '/tmp';

require_once __DIR__ . '/../includes/issue.php';
use function Profile\Issue\content_to_html;

final class Issue extends TestCase {
	public function test_content_to_html_関数はHTMLを返す() {
		$content = <<<'EOD'
<p>本文1</p>


<p>本文2</p>
EOD;

		$text = content_to_html( $content );
		$this->assertSame(
			<<<'EOD'
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body class="wp-block-post-content"><p>本文1</p>


<p>本文2</p></body>
</html>
EOD
			,
			$text
		);
	}
}
