import { expirationDateTimeLocaleFrom, isOp } from "@originator-profile/core";
import { Profile } from "../types/profile";
import Table from "./Table";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  profile: Profile;
  issuer?: string;
};

function TechTable({ className, profile, issuer }: Props) {
  return (
    <Table className={className}>
      <TableRow
        header="検証結果"
        data={profile.error instanceof Error ? "失敗" : "成功"}
      />
      {profile.error instanceof Error && (
        <TableRow
          header="検証エラー"
          data={`${profile.error.name}: ${profile.error.message}`}
        />
      )}
      <TableRow header={`識別子`} data={profile.subject} />
      <TableRow header={"発行者"} data={issuer ?? profile.issuer} />
      <TableRow
        header={`${isOp(profile) ? "OP レジストリ" : "OP 識別子"}`}
        data={profile.issuer}
      />
      <TableRow
        header="発行日"
        data={new Date(profile.issuedAt).toLocaleString()}
      />
      <TableRow
        header="有効期限"
        data={expirationDateTimeLocaleFrom(profile.expiredAt)}
      />
    </Table>
  );
}

export default TechTable;
