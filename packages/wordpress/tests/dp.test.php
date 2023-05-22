<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\UnencryptedToken;

const WP_CONTENT_DIR = '/tmp';

require_once __DIR__ . '/../includes/class-dp.php';
use Profile\Dp\Dp as DpClass;

final class Dp extends TestCase {
	public function test_sign_メソッドはJWTを返す() {
		$pkcs8       = <<<'EOF'
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgV9DoQPnmMSD603b+
8FMeLFuixyQvk3pjgXIIYiLoquahRANCAARuQOQiTiAyzTBmYFqHN/b1UbDzvaW/
Cu9W8v6HPsAZ8GI9/oVUlsGLge0SEDtDku2K4fkNIQVpPfX8zjm8jMGO
-----END PRIVATE KEY-----
EOF;
		$jws         = 'eyJhbGciOiJFUzI1NiIsImtpZCI6Imx6djNGQjBickRUbmo2RjZTaUhMd24xbmtlNmo5Z05lWlV6SE94M0RKSXMiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..ue1DpS2ElWcWlFQrl6PzJsNdmv1w0uJJNxAMmu5IVp5tEOSm-ut-h1g6Rwo-05cOpo3aiJDrUnZboDsFtt3tMg';
		$domain_name = 'example.com';
		$subject     = '55150c0a-4020-4233-8e77-880b2da55414';
		$url         = 'https://example.com/article/42';
		$dp          = new DpClass(
			issuer: $domain_name,
			url: $url,
			jws: $jws,
			subject: $subject,
			title: 'ブログはじめました',
			image: 'https://example.com/image/hello.png',
			description: 'こんにちは。今日からブログをはじめました。',
			author: '○△ 太郎',
			category: '日記',
			editor: '○△ 編集',
			date_published: '2023-03-23T02:00:00+00:00',
			date_modified: '2023-03-24T02:33:44+00:00',
		);
		$jwt         = $dp->sign( $pkcs8 );
		$token       = ( new Parser( new JoseEncoder() ) )->parse( $jwt );
		assert( $token instanceof UnencryptedToken );
		$this->assertEquals( true, $token->hasBeenIssuedBy( $domain_name ) );
		$this->assertEquals( true, $token->isRelatedTo( $subject ) );
		$dp_item  = $token->claims()->get( 'https://originator-profile.org/dp' )['item'];
		$snapshot = \json_decode( \file_get_contents( __DIR__ . '/snapshots/dp-item.json' ), true );
		$this->assertEquals( $snapshot, $dp_item );
	}
}
