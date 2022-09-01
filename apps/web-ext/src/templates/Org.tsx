import clsx from "clsx";
import { OpHolder } from "@webdino/profile-model";
import { Op } from "../types/profile";
import { Role } from "../types/role";
import Image from "../components/Image";
import BackHeader from "../components/BackHeader";
import VerifySuccessBadge from "../components/VerifySuccessBadge";
import VerifyFailureBadge from "../components/VerifyFailureBadge";
import Roles from "../components/Roles";
import HolderTable from "../components/HolderTable";
import Description from "../components/Description";
import CertifierTable from "../components/CertifierTable";
import TechTable from "../components/TechTable";

type Props = {
  op: Op;
  holder: OpHolder;
  roles: Role[];
  profileEndpoint: string;
  paths: { back: string };
};

function Org({ op, holder, roles, paths, profileEndpoint }: Props) {
  const logo = holder.logos?.find(({ isMain }) => isMain);
  return (
    <>
      <BackHeader className="sticky top-0" to={paths.back}>
        <h1 className="text-sm">所有者情報</h1>
      </BackHeader>
      <Image
        src={logo?.url}
        placeholderSrc="/assets/placeholder-logo-main.png"
        alt=""
        width={320}
        height={198}
      />
      <div className="px-3 py-3">
        {op.error instanceof Error ? (
          <VerifyFailureBadge
            className={clsx({ ["mb-1"]: roles.length > 0 })}
          />
        ) : (
          <VerifySuccessBadge
            className={clsx({ ["mb-1"]: roles.length > 0 })}
          />
        )}
        <Roles roles={roles} />
      </div>
      <hr className="border-gray-50 border-4" />
      <HolderTable holder={holder} />
      {holder.description && <Description description={holder.description} />}
      <hr className="border-gray-50 border-4" />
      <Image
        src="/assets/logo-certifier.png"
        placeholderSrc="/assets/placeholder-logo-main.png"
        alt=""
        width={320}
        height={198}
      />
      <hr className="border-gray-50 border-4" />
      <CertifierTable op={op} />
      <hr className="border-gray-50 border-4" />
      <TechTable profile={op} profileEndpoint={profileEndpoint} />
    </>
  );
}

export default Org;
