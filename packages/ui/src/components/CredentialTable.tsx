import { twMerge } from "tailwind-merge";
import { OpCredential } from "@originator-profile/model";
import {
  expirationDateTimeLocaleFrom,
  formatDatetoYYYYmd,
  isExpired,
} from "@originator-profile/core";
import { Table, TableRow } from "./";

type Credential = Omit<OpCredential, "type" | "certifier" | "verifier"> & {
  certifier: { id: string; name: string };
  verifier: { id: string; name: string };
};

/* @deprecated */
function CredentialTable({
  data,
  className,
}: {
  data: Credential;
  className?: string;
}) {
  return (
    <Table className={className}>
      <TableRow header="認定内容" data={data.name} />
      <TableRow header="認証機関" data={data.certifier.name} />
      <TableRow header="検証機関" data={data.verifier.name} />
      <TableRow
        className="[&_td]:text-gray-700"
        header="認定書発行日"
        data={formatDatetoYYYYmd(new Date(data.issuedAt))}
      />
      <TableRow
        className={twMerge(isExpired(data.expiredAt) && "[&_td]:text-danger")}
        header="有効期限"
        data={expirationDateTimeLocaleFrom(data.expiredAt, "ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      />
    </Table>
  );
}

export default CredentialTable;
