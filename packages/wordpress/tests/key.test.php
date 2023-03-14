<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../includes/key.php';

use function Profile\Key\key_gen;
use function Profile\Key\base64_urlsafe_encode;
use function Profile\Key\get_jwk;

final class Key extends TestCase {
	public function test_鍵の生成に成功() {
		$success = key_gen();
		$this->assertSame( true, $success );
		$content = \file_get_contents( __DIR__ . '/../credentials/profile.key.pem' );
		$match   = \preg_match( '/^-----BEGIN PRIVATE KEY-----$/', $content );
		$this->assertNotSame( false, $match );
	}

	public function test_base64_urlsafe_encode() {
		$base64urlsafe = base64_urlsafe_encode( 'A' . chr( 0xff ) . chr( 0xfe ) . 'z' );
		$this->assertSame( 'Qf_-eg', $base64urlsafe );
	}

	public function test_get_jwk() {
		$private_key = <<<'EOF'
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgV9DoQPnmMSD603b+
8FMeLFuixyQvk3pjgXIIYiLoquahRANCAARuQOQiTiAyzTBmYFqHN/b1UbDzvaW/
Cu9W8v6HPsAZ8GI9/oVUlsGLge0SEDtDku2K4fkNIQVpPfX8zjm8jMGO
-----END PRIVATE KEY-----
EOF;
		$jwk         = get_jwk( \openssl_pkey_get_private( $private_key ) );
		$snapshot    = \json_decode( \file_get_contents( __DIR__ . '/snapshots/jwk.json' ), true );
		$this->assertEquals( $snapshot, $jwk );
	}
}
