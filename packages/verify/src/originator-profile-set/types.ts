import {
  JwtVcDecodingResult,
  JwtVcDecodingResultPayload,
  JwtVcVerificationResult,
  JwtVcVerificationResultPayload,
} from "@originator-profile/jwt-securing-mechanism";
import {
  CoreProfile,
  Certificate as BasicCertificate,
  JapaneseExistenceCertificate,
  WebMediaProfile,
} from "@originator-profile/model";
import {
  CoreProfileNotFound,
  OpsVerifyFailed,
  OpVerifyFailed,
  OpInvalid,
  OpsInvalid,
} from "./errors";

export type Certificate = BasicCertificate | JapaneseExistenceCertificate;

/** Originator Profile 復号失敗 */
export type OpDecodingFailure = {
  core: JwtVcDecodingResult<CoreProfile>;
  annotations?: JwtVcDecodingResult<Certificate>[];
  media?: JwtVcDecodingResult<WebMediaProfile>;
};
/** 復号済み Originator Profile */
export type DecodedOp = {
  core: JwtVcDecodingResultPayload<CoreProfile>;
  annotations?: JwtVcDecodingResultPayload<Certificate>[];
  media: JwtVcDecodingResultPayload<WebMediaProfile>;
};
/** Originator Profile 復号結果 */
export type OpDecodingResult = DecodedOp | OpInvalid;
/** Originator Profile Set 復号失敗 */
export type OpsDecodingFailure = OpDecodingResult[];

/** 復号済み Originator Profile Set */
export type DecodedOps = DecodedOp[];
/** Originator Profile Set 復号結果 */
export type OpsDecodingResult = DecodedOps | OpsInvalid;

/** Originator Profile 検証失敗 */
export type OpVerificationFailure = {
  core: JwtVcVerificationResult<CoreProfile> | CoreProfileNotFound<CoreProfile>;
  annotations?: (
    | JwtVcVerificationResult<Certificate>
    | CoreProfileNotFound<Certificate>
  )[];
  media?:
    | JwtVcVerificationResult<WebMediaProfile>
    | CoreProfileNotFound<WebMediaProfile>;
};
/** 検証済み Originator Profile */
export type VerifiedOp = {
  core: JwtVcVerificationResultPayload<CoreProfile>;
  annotations?: JwtVcVerificationResultPayload<Certificate>[];
  media?: JwtVcVerificationResultPayload<WebMediaProfile>;
};
/** Originator Profile 検証結果 */
export type OpVerificationResult = VerifiedOp | OpVerifyFailed;
/** Originator Profile Set 検証失敗 */
export type OpsVerificationFailure = OpVerificationResult[];

/** 検証済み Originator Profile Set */
export type VerifiedOps = VerifiedOp[];
/** Originator Profile Set 検証結果 */
export type OpsVerificationResult = VerifiedOps | OpsInvalid | OpsVerifyFailed;
