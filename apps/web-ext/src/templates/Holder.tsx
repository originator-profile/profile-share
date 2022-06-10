import clsx from "clsx";
import { Op, OpHolder } from "../types/op";
import { Role } from "../types/role";
import Image from "../components/Image";
import BackHeader from "../components/BackHeader";
import VerifySuccessBadge from "../components/VerifySuccessBadge";
import VerifyFailureBadge from "../components/VerifyFailureBadge";
import Roles from "../components/Roles";
import HolderTable from "../components/HolderTable";
import Description from "../components/Description";
import NavLink from "../components/NavLink";

type Props = {
  op: Op;
  holder: OpHolder;
  roles: Role[];
  paths: { back: string; certifier: string; technicalInformation: string };
};

function Holder({ op, holder, roles, paths }: Props) {
  const logo = holder.logos?.find(({ isMain }) => isMain);
  return (
    <>
      <BackHeader className="sticky top-0" to={paths.back}>
        <h1 className="text-sm">所有者情報</h1>
      </BackHeader>
      <Image
        src={logo?.url}
        placeholderSrc="/assets/placeholder-logo-main.png"
        alt={`${holder.name}のロゴ`}
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
      <HolderTable className="w-full table-fixed" holder={holder} />
      {holder.description && <Description description={holder.description} />}
      <div className="px-3 pt-2 pb-20 bg-gray-50">
        <NavLink className="mb-2" to={paths.certifier}>
          認証機関
        </NavLink>
        <NavLink to={paths.technicalInformation}>技術情報</NavLink>
      </div>
    </>
  );
}

export default Holder;
