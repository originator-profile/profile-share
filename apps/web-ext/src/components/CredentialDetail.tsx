import clsx from "clsx";
import { Icon } from "@iconify/react";
import {
  OpCredential,
  OpHolder,
  OpCertifier,
  OpVerifier,
} from "@webdino/profile-model";
import { getVerificationType } from "../utils/credential";
import Image from "../components/Image";
import Table from "./Table";
import TableRow from "./TableRow";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";

type Props = {
  id: string;
  className?: string;
  credential: OpCredential;
  holder: OpHolder;
  certifier?: OpCertifier;
  verifier?: OpVerifier;
};

function CredentialDetail({
  id,
  className,
  credential,
  holder,
  certifier,
  verifier,
}: Props) {
  const verificationType = getVerificationType(credential, holder);
  return (
    <div id={id} className={clsx("jumpu-card p-4", className)}>
      <Image
        className="mb-4"
        src={credential.image}
        placeholderSrc={placeholderLogoMainUrl}
        alt=""
        width={110}
        height={70}
      />
      <div className="inline-flex items-center gap-2 bg-blue-50 px-2 py-1 mb-3 rounded-sm">
        <Icon
          className="flex-shrink-0 text-blue-500 text-base"
          icon="akar-icons:circle-check-fill"
        />
        <p className="flex-1 font-bold text-blue-500 text-xs">
          {verificationType}による認定です
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
          data={new Date(credential.expiredAt).toLocaleString()}
        />
      </Table>
    </div>
  );
}

export default CredentialDetail;
