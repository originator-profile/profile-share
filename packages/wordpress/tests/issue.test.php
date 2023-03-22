<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

const WP_CONTENT_DIR = '/tmp';

require_once __DIR__ . '/../includes/issue.php';

use function Profile\Issue\sign_body;

final class Issue extends TestCase {
	public function test_sign_body_関数はDetached_Compact_JWSを返す() {
		$body  = 'Hello, world!';
		$pkcs8 = <<<'EOF'
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgV9DoQPnmMSD603b+
8FMeLFuixyQvk3pjgXIIYiLoquahRANCAARuQOQiTiAyzTBmYFqHN/b1UbDzvaW/
Cu9W8v6HPsAZ8GI9/oVUlsGLge0SEDtDku2K4fkNIQVpPfX8zjm8jMGO
-----END PRIVATE KEY-----
EOF;
		$jws   = sign_body( $body, $pkcs8 );

		list( $protected, $payload, $signature ) = \explode( '.', $jws );
		$this->assertNotEmpty( $protected );
		$this->assertSame( '', $payload );
		$this->assertNotEmpty( $signature );
	}
}
