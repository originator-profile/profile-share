<?php
/** Document Profile */

namespace Profile\Dp;

use Lcobucci\JWT\Token\Builder;
use Lcobucci\JWT\Encoding\ChainedFormatter;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Signer\Ecdsa\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_SIGN_TYPE;
use const Profile\Config\PROFILE_SIGN_LOCATION;

require_once __DIR__ . '/key.php';
use function Profile\Key\get_jwk;

/** DP */
final class Dp {
	/**
	 * DP生成
	 *
	 * @param string $issuer レジストリドメイン名
	 * @param string $subject 投稿のパーマリンクのリンク
	 * @param string $jws 対象のテキストへの署名
	 */
	public function __construct(
		public string $issuer,
		public string $subject,
		public string $jws,
	) {}


	/**
	 * DPへの署名
	 *
	 * @param string $pkcs8 PEM base64 でエンコードされた PKCS #8 秘密鍵またはそのファイルパス
	 * @return string|false 成功した場合Signed DP、失敗した場合はfalse
	 */
	public function sign( string $pkcs8 ): string|false {
		$pkey = \openssl_pkey_get_private( $pkcs8 );
		$jwk  = get_jwk( $pkey );

		if ( ! $jwk ) {
			return false;
		}

		$dp = array(
			'type'      => 'dp',
			'issuedAt'  => \gmdate( 'c' ),
			'expiredAt' => \gmdate( 'c', \strtotime( '+ 1 year' ) ),
			'issuer'    => $this->issuer,
			'subject'   => $this->subject,
			'item'      => array(
				array(
					'type' => 'website',
					'url'  => $this->subject,
				),
				array(
					'type'     => PROFILE_SIGN_TYPE,
					'url'      => $this->subject,
					'location' => PROFILE_SIGN_LOCATION,
					'proof'    => array( 'jws' => $this->jws ),
				),
			),
		);

		$builder = (
				new Builder( new JoseEncoder(), ChainedFormatter::withUnixTimestampDates() )
			)
				->withHeader( 'alg', $jwk['alg'] )
				->withHeader( 'kid', $jwk['kid'] )
				->issuedBy( $dp['issuer'] )
				->relatedTo( $dp['subject'] )
				->issuedAt(
					( new \DateTimeImmutable() )
					->setTimestamp( \strtotime( $dp['issuedAt'] ) )
				)
				->expiresAt(
					( new \DateTimeImmutable() )
					->setTimestamp( \strtotime( $dp['expiredAt'] ) )
				)
				->withClaim( 'https://opr.webdino.org/jwt/claims/dp', array( 'item' => $dp['item'] ) );

		$jwt = $builder->getToken( new Sha256(), InMemory::plainText( $pkcs8 ) );

		return $jwt->toString();
	}
}
