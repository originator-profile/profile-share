import { OriginatorProfile, Profile } from "../utils/profile";
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
      <TableRow header="検証結果" data={profile.printVerificationStatus()} />
      {profile.hasError() && (
        <TableRow header="検証エラー" data={profile.printVerificationError()} />
      )}
      <TableRow header={`識別子`} data={profile.subject} />
      <TableRow header={"発行者"} data={issuer ?? profile.issuer} />
      <TableRow
        header={`${profile instanceof OriginatorProfile ? "OP レジストリ" : "OP 識別子"}`}
        data={profile.issuer}
      />
      <TableRow header="発行日" data={[profile.printIssuedAt()]} />
      <TableRow header="有効期限" data={profile.printExpiredAt()} />
    </Table>
  );
}

export default TechTable;
