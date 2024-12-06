import { CaVerificationResult } from "@originator-profile/verify";

export type CasProps = {
  cas: (
    | CaVerificationResult
    | { main: boolean; attestation: CaVerificationResult }
  )[];
};
