import { Op } from "../types/op";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  op: Op;
};

function CertifierTable({ className, op }: Props) {
  return (
    <table className={className}>
      <tbody>
        <TableRow
          header="認証機関"
          data="一般社団法人 デジタル広告品質認証機構"
        />
        <TableRow header="所在地" data="〒104-0061 東京都中央区銀座3-10-7" />
        <TableRow
          header="URL"
          data={
            <a
              className="anchor-link"
              href="https://www.jicdaq.or.jp"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.jicdaq.or.jp
            </a>
          }
        />
        <TableRow
          header="電話番号"
          data={
            <a className="anchor-link" href="tel:03-6264-2065">
              03-6264-2065
            </a>
          }
        />
        <TableRow
          header="認定日"
          data={new Date(op.issuedAt).toLocaleString("ja-JP")}
        />
        <TableRow
          header="有効期限"
          data={new Date(op.expiredAt).toLocaleString("ja-JP")}
        />
        <TableRow header="認定内容" data="ブランドセーフティ認証" />
        <TableRow header="検証機関" data="一般社団法人 日本ABC協会" />
      </tbody>
    </table>
  );
}

export default CertifierTable;
