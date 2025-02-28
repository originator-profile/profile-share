<?php
/** 未署名 Content Attestation */

namespace Profile\Uca;

require_once __DIR__ . '/config.php';
use const Profile\Config\PROFILE_CA_TARGET_TYPE;
use const Profile\Config\PROFILE_CA_TARGET_CSS_SELECTOR;

/** 未署名 Content Attestation */
final class Uca {
	/**
	 * 未署名 Content Attestation
	 *
	 * @param string  $issuer CA 発行者
	 * @param string  $url 投稿のパーマリンクURL
	 * @param string  $locale ロケール
	 * @param string  $html HTML
	 * @param array   $external_resources 外部リソース
	 * @param ?string $headline (optional) タイトル
	 * @param ?string $image (optional) 画像URL
	 * @param ?string $description (optional) 説明
	 * @param ?string $author (optional) 著者
	 * @param ?string $date_published (optional) 公開日時
	 * @param ?string $date_modified (optional) 最終更新日時
	 */
	public function __construct(
		public string $issuer,
		public string $url,
		public string $locale,
		public string $html,
		public array $external_resources,
		public ?string $headline = null,
		public ?string $image = null,
		public ?string $description = null,
		public ?string $author = null,
		public ?string $date_published = null,
		public ?string $date_modified = null,
	) {}


	/**
	 * JSON への変換
	 *
	 * @return mixed JSON
	 */
	public function to_json(): string|false {
		$uca = array(
			'@context'          => array(
				'https://www.w3.org/ns/credentials/v2',
				'https://originator-profile.org/ns/credentials/v1',
				'https://originator-profile.org/ns/cip/v1',
				array(
					'@language' => $this->locale,
				),
			),
			'type'              => array( 'VerifiableCredential', 'ContentAttestation' ),
			'issuer'            => $this->issuer,
			'credentialSubject' => array(
				'type'          => 'Article',
				'headline'      => $this->headline,
				'image'         => $this->image ? array( 'id' => $this->image ) : null,
				'description'   => $this->description,
				'author'        => $this->author ? array( $this->author ) : null,
				'datePublished' => $this->date_published,
				'dateModified'  => $this->date_modified,
			),
			'allowedUrl'        => $this->url,
			'target'            => array_merge(
				array(
					array(
						'type'        => PROFILE_CA_TARGET_TYPE,
						'content'     => $this->html,
						'cssSelector' => PROFILE_CA_TARGET_CSS_SELECTOR,
					),
				),
				array_map(
					fn( $integrity ) => array(
						'type'      => 'ExternalResourceTargetIntegrity',
						'integrity' => $integrity,
					),
					$this->external_resources,
				)
			),
		);

		$uca['credentialSubject'] = array_filter(
			$uca['credentialSubject'],
			function ( mixed $val ) {
				return ! is_null( $val );
			}
		);

		return \wp_json_encode( $uca );
	}
}
