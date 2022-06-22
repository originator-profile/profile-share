import { Profile } from "../types/profile";
import BackHeader from "../components/BackHeader";
import TechTable from "../components/TechTable";

type Props = {
  profile: Profile;
  profileEndpoint: string;
  paths: { back: string };
};

function Tech({ profile, profileEndpoint, paths }: Props) {
  return (
    <>
      <BackHeader className="sticky top-0" to={paths.back}>
        <h1 className="text-sm">技術情報</h1>
      </BackHeader>
      <TechTable
        className="w-full table-fixed"
        profile={profile}
        profileEndpoint={profileEndpoint}
      />
    </>
  );
}

export default Tech;
