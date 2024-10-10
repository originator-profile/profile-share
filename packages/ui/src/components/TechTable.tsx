import { OriginatorProfile, Profile } from "../utils/profile";
import Table from "./Table";
import TableRow from "./TableRow";
import { _ } from "../utils";

type Props = {
  className?: string;
  profile: Profile;
  issuer?: string;
};

function TechTable({ className, profile, issuer }: Props) {
  return (
    <Table className={className}>
      <TableRow
        header={_("TechTable_VerificationResult")}
        data={profile.printVerificationStatus()}
      />
      {profile.hasError() && (
        <TableRow
          header={_("TechTable_VerificationError")}
          data={profile.printVerificationError()}
        />
      )}
      <TableRow header={_("TechTable_Subject")} data={profile.subject} />
      <TableRow
        header={_("TechTable_Issuer")}
        data={issuer ?? profile.issuer}
      />
      <TableRow
        header={`${profile instanceof OriginatorProfile ? _("TechTable_OPRegistry") : _("TechTable_OPSubject")}`}
        data={profile.issuer}
      />
      <TableRow
        header={_("TechTable_IssuedAt")}
        data={[profile.printIssuedAt()]}
      />
      <TableRow
        header={_("TechTable_ExpiredAt")}
        data={profile.printExpiredAt()}
      />
    </Table>
  );
}

export default TechTable;
