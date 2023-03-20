<?php
/** 鍵 */

namespace Profile\Key;

/** プライベート鍵ファイル */
const PROFILE_PRIVATE_KEY_FILENAME = WP_CONTENT_DIR . '/credentials/profile.key.pem';

/** 鍵の初期化 */
function init() {
	\add_action( 'activated_plugin', '\Profile\Key\activate_key' );
}

/** 鍵の有効化 */
function activate_key() {
	$exists = key_exists();

	if ( $exists ) {
		return;
	}

	key_gen();
}

/**
 * プライベート鍵の存在確認
 *
 * @return bool 存在する場合はtrue、存在しない場合はfalse
 */
function key_exists() {
	return \file_exists( PROFILE_PRIVATE_KEY_FILENAME );
};

/**
 * PEM形式のECDSAP256SHA256プライベート鍵の生成
 *
 * @return bool 生成に成功した場合はtrue、失敗した場合はfalse
 */
function key_gen() {
	\mkdir( \dirname( PROFILE_PRIVATE_KEY_FILENAME ), 0o750, true );
	\touch( PROFILE_PRIVATE_KEY_FILENAME );
	\chmod( PROFILE_PRIVATE_KEY_FILENAME, 0o600 );

	$options = array(
		'private_key_type' => OPENSSL_KEYTYPE_EC,
		'curve_name'       => 'prime256v1',
	);
	$pkey    = \openssl_pkey_new( $options );

	if ( ! $pkey ) {
		return false;
	}

	$ret = \openssl_pkey_export_to_file( $pkey, PROFILE_PRIVATE_KEY_FILENAME );

	if ( $ret ) {
		\chmod( PROFILE_PRIVATE_KEY_FILENAME, 0o400 );
	}

	return $ret;
}

/**
 * URL-safe Base64でデータをエンコードする
 *
 * @param string $data エンコードするデータ
 * @return string URL-safe Base64
 */
function base64_urlsafe_encode( string $data ): string {
	return \sodium_bin2base64( $data, SODIUM_BASE64_VARIANT_URLSAFE_NO_PADDING );
}

/**
 * プライベート鍵ファイルからJWK公開鍵を得る
 *
 * @return array|false 成功した場合はJWK公開鍵、失敗した場合はfalse
 */
function get_jwk_from_file(): array|false {
	$private_key = \file_get_contents( PROFILE_PRIVATE_KEY_FILENAME );
	$jwk         = get_jwk( \openssl_pkey_get_private( $private_key ) );

	return $jwk;
}

/**
 * 鍵からJWK公開鍵を得る
 *
 * @param \OpenSSLAsymmetricKey $key 鍵
 * @return array|false 成功した場合はJWK公開鍵、失敗した場合はfalse
 */
function get_jwk( \OpenSSLAsymmetricKey $key ): array|false {
	$details = \openssl_pkey_get_details( $key );

	if ( ! $details ) {
		return false;
	}

	if ( OPENSSL_KEYTYPE_EC !== $details['type'] ) {
		return false;
	}

	if ( 'prime256v1' !== $details['ec']['curve_name'] ) {
		return false;
	}

	$jwk = array(
		'crv' => 'P-256',
		'kty' => 'EC',
		'x'   => base64_urlsafe_encode( $details['ec']['x'] ),
		'y'   => base64_urlsafe_encode( $details['ec']['y'] ),
	);

	/** SHA-256ハッシュで計算されるJWK Thumbprintの作成 (RFC 7638) */
	$jwk['kid'] = base64_urlsafe_encode( \hash( 'sha256', \json_encode( $jwk ), true ) );
	$jwk['alg'] = 'ES256';
	$jwk['use'] = 'sig';

	return $jwk;
}
