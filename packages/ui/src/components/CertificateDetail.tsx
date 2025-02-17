import { Icon } from "@iconify/react";
import { formatLocaleDate } from "@originator-profile/core";
import { VerifiedVc } from "@originator-profile/securing-mechanism";
import { Certificate } from "@originator-profile/verify";
import { twMerge } from "tailwind-merge";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";
import { _ } from "../utils/get-message";
import Image from "./Image";
import Table from "./Table";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  certificate: VerifiedVc<Certificate>;
};

function CertificateTable({ certificate }: Omit<Props, "className">) {
  return (
    <Table>
      <TableRow
        header={_("CertificateDetail_CredentialName")}
        data={certificate.doc.credentialSubject.certificationSystem.name}
      />
      <TableRow
        header={_("CertificateDetail_Certifier")}
        data={
          certificate.doc.credentialSubject.type === "CertificateProperties"
            ? (certificate.doc.credentialSubject.certifier ??
              certificate.doc.issuer)
            : certificate.doc.issuer
        }
      />
      {certificate.doc.credentialSubject.type === "CertificateProperties" &&
        certificate.doc.credentialSubject.verifier && (
          <TableRow
            header={_("CertificateDetail_Verifier")}
            data={certificate.doc.credentialSubject.verifier}
          />
        )}
      {certificate.issuedAt && (
        <TableRow
          header={_("CertificateDetail_IssuedAt")}
          data={formatLocaleDate(certificate.issuedAt)}
        />
      )}
      {certificate.expiredAt && (
        <TableRow
          header={_("CertificateDetail_ExpiredAt")}
          data={formatLocaleDate(certificate.expiredAt)}
        />
      )}
    </Table>
  );
}

function CertificateDetail({ className, certificate }: Props) {
  return (
    <div className={twMerge("jumpu-card p-5 rounded-2xl space-y-2", className)}>
      <header className="flex items-center gap-4 mb-4">
        <Image
          src={
            certificate.doc.credentialSubject.type === "CertificateProperties"
              ? certificate.doc.credentialSubject.image?.id
              : undefined
          }
          placeholderSrc={placeholderLogoMainUrl}
          alt=""
          width={60}
          height={40}
        />
        <div>
          <h2 className="text-xs font-bold mb-1.5">
            {certificate.doc.credentialSubject.certificationSystem.name}
          </h2>
          <p className="text-xs text-gray-600">
            {_("CertificateDetail_IssuedBy", certificate.doc.issuer)}
          </p>
        </div>
      </header>
      {"description" in certificate.doc.credentialSubject && (
        <p className="text-sm text-gray-600">
          {certificate.doc.credentialSubject.description}
        </p>
      )}
      <p className="text-sm text-gray-600">
        {certificate.doc.credentialSubject.certificationSystem.description}
      </p>
      <CertificateTable certificate={certificate} />
      {certificate.doc.credentialSubject.certificationSystem.ref && (
        <a
          className="card border px-5 py-3 flex items-center justify-between gap-2.5 rounded-2xl"
          target="_blank"
          rel="noopener noreferrer"
          href={certificate.doc.credentialSubject.certificationSystem.ref}
        >
          <span className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">
              {_("CertificateDetail_Details")}
            </span>
            <span className="text-sm">
              {certificate.doc.credentialSubject.certificationSystem.ref}
            </span>
          </span>
          <Icon
            className="text-sm text-gray-500"
            icon="fa6-solid:arrow-right"
          />
        </a>
      )}
    </div>
  );
}

export default CertificateDetail;
