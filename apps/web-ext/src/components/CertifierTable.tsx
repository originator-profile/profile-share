import { Op } from "../types/profile";
import Table from "./Table";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  op: Op;
};

function CertifierTable({ className, op }: Props) {
  return (
    <Table className={className}>
      <TableRow header="認定内容" data="ブランドセーフティ認証" />
      <TableRow header="認証機関" data="一般社団法人 第三者認証機関" />
      <TableRow header="検証機関" data="一般社団法人 第三者認証機関" />
      <TableRow
        header="認定日"
        data={new Date(op.issuedAt).toLocaleString(navigator.language)}
      />
      <TableRow
        header="有効期限"
        data={new Date(op.expiredAt).toLocaleString(navigator.language)}
      />
    </Table>
  );
}

export default CertifierTable;
