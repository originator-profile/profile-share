import { OpHolder } from "@webdino/profile-model";
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
          data={
            <a
              className="anchor-link"
              href={holder.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {holder.url}
            </a>
          }
        />
        {"phoneNumber" in holder && (
          <TableRow
            header="電話番号"
            data={
              <a className="anchor-link" href={`tel:${holder.phoneNumber}`}>
                {holder.phoneNumber}
              </a>
            }
          />
        )}
        {"email" in holder && (
          <TableRow
            header="メールアドレス"
            data={
              <a className="anchor-link" href={`mailto:${holder.email}`}>
                {holder.email}
              </a>
            }
          />
        )}
        {"contactUrl" in holder && (
          <TableRow
            header="問い合わせ"
            data={
              <a
                className="anchor-link"
                href={holder.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {holder.contactTitle ?? holder.contactUrl}
              </a>
            }
          />
        )}
        {"privacyPolicyUrl" in holder && (
          <TableRow
            header="プライバシーポリシー"
            data={
              <a
                className="anchor-link"
                href={holder.privacyPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {holder.privacyPolicyTitle ?? holder.privacyPolicyUrl}
              </a>
            }
          />
        )}
        {"publishingPrincipleUrl" in holder && (
          <TableRow
            header="編集ガイドライン"
            data={
              <a
                className="anchor-link"
                href={holder.publishingPrincipleUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {holder.publishingPrincipleTitle ??
                  holder.publishingPrincipleUrl}
              </a>
            }
          />
        )}
    </Table>
  );
}

export default HolderTable;
