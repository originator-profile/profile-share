<?php
/** Document Profile */

namespace Profile\Dp;

use Lcobucci\JWT\Token\Builder;
use Lcobucci\JWT\Encoding\ChainedFormatter;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Signer\Ecdsa\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_VERIFICATION_TYPE;
use const Profile\Config\PROFILE_VERIFICATION_LOCATION;

require_once __DIR__ . '/key.php';
use function Profile\Key\get_jwk;

/** DP */
final class Dp {
	/**
	 * DP生成
	 *
	 * @param string  $issuer レジストリドメイン名
	 * @param string  $subject ウェブページ ID
	 * @param string  $url 投稿のパーマリンクURL
	 * @param string  $jws 対象のテキストへの署名
	 * @param ?string $title (optional) タイトル
	 * @param ?string $image (optional) 画像URL
	 * @param ?string $description (optional) 説明
	 * @param ?string $author (optional) https://schema.org/author
	 * @param ?array  $category (optional) 情報カテゴリー
	 * @param ?string $editor (optional) https://schema.org/editor
	 * @param ?string $date_published (optional) https://schema.org/datePublished
	 * @param ?string $date_modified (optional) https://schema.org/dateModified
	 */
	public function __construct(
		public string $issuer,
		public string $subject,
		public string $url,
		public string $jws,
		public ?string $title = null,
		public ?string $image = null,
		public ?string $description = null,
		public ?string $author = null,
		public ?array $category = null,
		public ?string $editor = null,
		public ?string $date_published = null,
		public ?string $date_modified = null,
	) {}

	/**
	 * DPへの署名
	 *
	 * @param string $pkcs8 PEM base64 でエンコードされた PKCS #8 プライベート鍵またはそのファイルパス
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
				array_filter(
					array(
						'type'                             => 'website',
						'url'                              => $this->url,
						'title'                            => $this->title,
						'image'                            => $this->image,
						'description'                      => $this->description,
						'https://schema.org/author'        => $this->author,
						'category'                         => $this->category,
						'https://schema.org/editor'        => $this->editor,
						'https://schema.org/datePublished' => $this->date_published,
						'https://schema.org/dateModified'  => $this->date_modified,
					)
				),
				array(
					'type'     => PROFILE_VERIFICATION_TYPE,
					'url'      => $this->url,
					'location' => PROFILE_VERIFICATION_LOCATION,
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
				->withClaim( 'https://originator-profile.org/dp', array( 'item' => $dp['item'] ) );

		$jwt = $builder->getToken( new Sha256(), InMemory::plainText( $pkcs8 ) );

		return $jwt->toString();
	}
}
