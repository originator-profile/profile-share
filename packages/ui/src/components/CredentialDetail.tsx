import clsx from "clsx";
import {
  OpCredential,
  OpHolder,
  OpCertifier,
  OpVerifier,
} from "@originator-profile/model";
import { expirationDateTimeLocaleFrom } from "@originator-profile/core";
import { getVerificationType } from "../utils/credential";
import Image from "../components/Image";
import Table from "./Table";
import TableRow from "./TableRow";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";
import logomarkUrl from "../assets/logomark.svg";

type Props = {
  className?: string;
  credential: OpCredential;
  holder: OpHolder;
  certifier?: OpCertifier;
  verifier?: OpVerifier;
};

function CredentialDetail({
  className,
  credential,
  holder,
  certifier,
  verifier,
}: Props) {
  const verificationType = getVerificationType(credential, holder);

  return (
    <div className={clsx("jumpu-card p-5 rounded-2xl", className)}>
      <Image
        className="mb-4"
        src={credential.image}
        placeholderSrc={placeholderLogoMainUrl}
        alt=""
        width={110}
        height={70}
      />
      <div className="inline-flex items-center gap-2 bg-blue-50 px-2 py-1 mb-3 rounded-sm">
        <img src={logomarkUrl} alt="" width={16} height={14} />
        <p className="flex-1 font-bold text-blue-500 text-xs">
          {verificationType}による認証です
        </p>
      </div>
      <Table>
        <TableRow header="資格名" data={credential.name} />
        <TableRow
          header="認証機関"
          data={certifier?.name ?? credential.certifier}
        />
        <TableRow
          header="検証機関"
          data={verifier?.name ?? credential.verifier}
        />
        <TableRow
          header="発行日"
          data={new Date(credential.issuedAt).toLocaleString()}
        />
        <TableRow
          header="有効期限"
          data={expirationDateTimeLocaleFrom(credential.expiredAt)}
        />
      </Table>
    </div>
  );
}

export default CredentialDetail;
