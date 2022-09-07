import { isOp } from "@webdino/profile-core";
import { Profile } from "../types/profile";
import Table from "./Table";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  profile: Profile;
  profileEndpoint: string;
};

function TechTable({ className, profile, profileEndpoint }: Props) {
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
        <TableRow header="取得エンドポイント" data={profileEndpoint} />
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
          data={new Date(profile.issuedAt).toLocaleString(navigator.language)}
        />
        <TableRow
          header="有効期限"
          data={new Date(profile.expiredAt).toLocaleString(navigator.language)}
        />
    </Table>
  );
}

export default TechTable;
