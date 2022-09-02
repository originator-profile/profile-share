import clsx from "clsx";
import { Op } from "../types/profile";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  op: Op;
};

function CertifierTable({ className, op }: Props) {
  return (
    <table className={clsx("w-full table-fixed", className)}>
      <tbody>
        <TableRow header="認証機関" data="一般社団法人 第三者認証機関" />
        <TableRow header="所在地" data="〒100-8111 東京都千代田区千代田1-1" />
        <TableRow
          header="URL"
          data={
            <a
              className="anchor-link"
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://example.com
            </a>
          }
        />
        <TableRow
          header="電話番号"
          data={
            <a className="anchor-link" href="tel:03-1234-5678">
              03-1234-5678
            </a>
          }
        />
        <TableRow
          header="認定日"
          data={new Date(op.issuedAt).toLocaleString(navigator.language)}
        />
        <TableRow
          header="有効期限"
          data={new Date(op.expiredAt).toLocaleString(navigator.language)}
        />
        <TableRow header="認定内容" data="ブランドセーフティ認証" />
        <TableRow header="検証機関" data="一般社団法人 第三者認証機関" />
      </tbody>
    </table>
  );
}

export default CertifierTable;
