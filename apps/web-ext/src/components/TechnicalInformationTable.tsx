import { Op } from "../types/op";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  op: Op;
  targetOrigin?: string;
};

function TechnicalInformationTable({ className, op, targetOrigin }: Props) {
  return (
    <table className={className}>
      <tbody>
        <TableRow
          header="OP 文書"
          data={`${targetOrigin}/.well-known/op-document`}
        />
        <TableRow header="OP 識別子" data={op.subject} />
        <TableRow header="OP レジストリ" data={op.issuer} />
        <TableRow
          header="発行日"
          data={new Date(op.issuedAt).toLocaleString("ja-JP")}
        />
        <TableRow
          header="有効期限"
          data={new Date(op.expiredAt).toLocaleString("ja-JP")}
        />
      </tbody>
    </table>
  );
}

export default TechnicalInformationTable;
