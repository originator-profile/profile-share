import { OpHolder } from "@originator-profile/model";
import { ExternalLink } from "./link";
import Table from "./Table";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  holder: OpHolder;
};

function HolderTable({ className, holder }: Props) {
  return (
    <Table className={className}>
      <TableRow header="所有者" data={holder.name} />
      <TableRow
        header="所在地"
        data={`〒${holder.postalCode} ${holder.addressRegion}${holder.addressLocality}${holder.streetAddress}`}
      />
      <TableRow
        header="URL"
        data={<ExternalLink href={holder.url}>{holder.url}</ExternalLink>}
      />
      {"phoneNumber" in holder && (
        <TableRow
          header="電話番号"
          data={
            <ExternalLink href={`tel:${holder.phoneNumber}`}>
              {holder.phoneNumber}
            </ExternalLink>
          }
        />
      )}
      {"email" in holder && (
        <TableRow
          header="メールアドレス"
          data={
            <ExternalLink href={`mailto:${holder.email}`}>
              {holder.email}
            </ExternalLink>
          }
        />
      )}
      {"corporateNumber" in holder && (
        <TableRow
          header="法人番号"
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
          header="問い合わせ"
          data={
            <ExternalLink href={holder.contactUrl}>
              {holder.contactTitle ?? holder.contactUrl}
            </ExternalLink>
          }
        />
      )}
      {"privacyPolicyUrl" in holder && (
        <TableRow
          header="プライバシーポリシー"
          data={
            <ExternalLink href={holder.privacyPolicyUrl}>
              {holder.privacyPolicyTitle ?? holder.privacyPolicyUrl}
            </ExternalLink>
          }
        />
      )}
      {"publishingPrincipleUrl" in holder && (
        <TableRow
          header="編集ガイドライン"
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
