import { OpHolder } from "@originator-profile/model";
import { ExternalLink } from "./link";
import Table from "./Table";
import TableRow from "./TableRow";
import { _ } from "../utils";

type Props = {
  className?: string;
  holder: OpHolder;
};

function HolderTable({ className, holder }: Props) {
  return (
    <Table className={className}>
      <TableRow header={_("HolderTable_Holder")} data={holder.name} />
      <TableRow
        header={_("HolderTable_Address")}
        data={_("HolderTable_AddressData", [
          holder.postalCode,
          holder.addressRegion,
          holder.addressLocality,
          holder.streetAddress,
        ])}
      />
      <TableRow
        header={_("HolderTable_URL")}
        data={<ExternalLink href={holder.url}>{holder.url}</ExternalLink>}
      />
      {"phoneNumber" in holder && (
        <TableRow
          header={_("HolderTable_PhoneNum")}
          data={
            <ExternalLink href={`tel:${holder.phoneNumber}`}>
              {holder.phoneNumber}
            </ExternalLink>
          }
        />
      )}
      {"email" in holder && (
        <TableRow
          header={_("HolderTable_Email")}
          data={
            <ExternalLink href={`mailto:${holder.email}`}>
              {holder.email}
            </ExternalLink>
          }
        />
      )}
      {"corporateNumber" in holder && (
        <TableRow
          header={_("HolderTable_CorpNum")}
          data={
            <ExternalLink
              href={`https://info.gbiz.go.jp/hojin/ichiran?hojinBango=${holder.corporateNumber}`}
            >
              {holder.corporateNumber}
            </ExternalLink>
          }
        />
      )}
      {"contactUrl" in holder && (
        <TableRow
          header={_("HolderTable_Contact")}
          data={
            <ExternalLink href={holder.contactUrl}>
              {holder.contactTitle ?? holder.contactUrl}
            </ExternalLink>
          }
        />
      )}
      {"privacyPolicyUrl" in holder && (
        <TableRow
          header={_("HolderTable_PrivacyPolicy")}
          data={
            <ExternalLink href={holder.privacyPolicyUrl}>
              {holder.privacyPolicyTitle ?? holder.privacyPolicyUrl}
            </ExternalLink>
          }
        />
      )}
      {"publishingPrincipleUrl" in holder && (
        <TableRow
          header={_("HolderTable_Principle")}
          data={
            <ExternalLink href={holder.publishingPrincipleUrl}>
              {holder.publishingPrincipleTitle ?? holder.publishingPrincipleUrl}
            </ExternalLink>
          }
        />
      )}
    </Table>
  );
}

export default HolderTable;
