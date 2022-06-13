import { Profile } from "../types/profile";
import { isOp } from "../utils/op";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  profile: Profile;
  targetOrigin?: string;
};

function TechTable({ className, profile, targetOrigin }: Props) {
  return (
    <table className={className}>
      <tbody>
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
        <TableRow
          header="プロファイル 文書"
          data={`${targetOrigin}/.well-known/op-document`}
        />
        <TableRow
          header={`${isOp(profile) ? "OP" : "DP"} 識別子`}
          data={profile.subject}
        />
        <TableRow
          header={`${isOp(profile) ? "OP レジストリ" : "OP 識別子"}`}
          data={profile.issuer}
        />
        <TableRow
          header="発行日"
          data={new Date(profile.issuedAt).toLocaleString("ja-JP")}
        />
        <TableRow
          header="有効期限"
          data={new Date(profile.expiredAt).toLocaleString("ja-JP")}
        />
      </tbody>
    </table>
  );
}

export default TechTable;
