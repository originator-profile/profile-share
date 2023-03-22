<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\UnencryptedToken;

const WP_CONTENT_DIR = '/tmp';

require_once __DIR__ . '/../includes/issue.php';
use function Profile\Issue\sign_body;
use function Profile\Issue\sign_dp;

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

	public function test_sign_dp_関数はJWTを返す() {
		$pkcs8       = <<<'EOF'
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgV9DoQPnmMSD603b+
8FMeLFuixyQvk3pjgXIIYiLoquahRANCAARuQOQiTiAyzTBmYFqHN/b1UbDzvaW/
Cu9W8v6HPsAZ8GI9/oVUlsGLge0SEDtDku2K4fkNIQVpPfX8zjm8jMGO
-----END PRIVATE KEY-----
EOF;
		$jws         = 'eyJhbGciOiJFUzI1NiIsImtpZCI6Imx6djNGQjBickRUbmo2RjZTaUhMd24xbmtlNmo5Z05lWlV6SE94M0RKSXMiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..ue1DpS2ElWcWlFQrl6PzJsNdmv1w0uJJNxAMmu5IVp5tEOSm-ut-h1g6Rwo-05cOpo3aiJDrUnZboDsFtt3tMg';
		$domain_name = 'example.com';
		$url         = 'https://example.com/article/42';
		$jwt         = sign_dp( $domain_name, $url, $jws, $pkcs8 );
		$token       = ( new Parser( new JoseEncoder() ) )->parse( $jwt );
		assert( $token instanceof UnencryptedToken );
		$this->assertEquals( true, $token->hasBeenIssuedBy( $domain_name ) );
		$this->assertEquals( true, $token->isRelatedTo( $url ) );
		$dp_item  = $token->claims()->get( 'https://opr.webdino.org/jwt/claims/dp' );
		$snapshot = \json_decode( \file_get_contents( __DIR__ . '/snapshots/dp-item.json' ), true );
		$this->assertEquals( $snapshot, $dp_item );
	}
}
