import { Profile } from "../types/profile";
import { Paths } from "../types/routes";
import BackHeader from "../components/BackHeader";
import TechnicalInformationTable from "../components/TechnicalInformationTable";

type Props = {
  profile: Profile;
  targetOrigin?: string;
  paths: Paths;
};

function TechnicalInformation({ profile, targetOrigin, paths }: Props) {
  return (
    <>
      <BackHeader className="sticky top-0" to={paths.back}>
        <h1 className="text-sm">技術情報</h1>
      </BackHeader>
      <TechnicalInformationTable
        className="w-full table-fixed"
        profile={profile}
        targetOrigin={targetOrigin}
      />
    </>
  );
}

export default TechnicalInformation;
