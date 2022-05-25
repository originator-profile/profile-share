import clsx from "clsx";
import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { isHolder, isOp } from "../utils/op";
import { Op, OpHolder } from "../types/op";
import { Role } from "../types/role";
import { toRoles } from "../utils/role";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Image from "../components/Image";
import BackHeader from "../components/BackHeader";
import VerifySuccessBadge from "../components/VerifySuccessBadge";
import VerifyFailureBadge from "../components/VerifyFailureBadge";
import Roles from "../components/Roles";
import HolderTable from "../components/HolderTable";
import NavLink from "../components/NavLink";

function Page({
  op,
  holder,
  roles,
}: {
  op: Op;
  holder: OpHolder;
  roles: Role[];
}) {
  const logo = holder.logos?.find(({ isMain }) => isMain);

  return (
    <>
      <BackHeader className="sticky top-0" to="/">
        <h1 className="text-base">所有者情報</h1>
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
      <HolderTable className="w-full" holder={holder} />
      {holder.description && (
        <section className="px-3 py-2 border-gray-200 border-b">
          <h2 className="mb-1 text-gray-500 font-normal">説明</h2>
          <div
            className="prose prose-sm"
            dangerouslySetInnerHTML={{
              __html: holder.description,
            }}
          />
        </section>
      )}
      <div className="px-3 pt-2 pb-20 bg-gray-50">
        <NavLink
          className="mb-2"
          to={`/${encodeURIComponent(op.subject)}/certifier`}
        >
          認証機関
        </NavLink>
        <NavLink
          to={`/${encodeURIComponent(op.subject)}/technical-information`}
        >
          技術情報
        </NavLink>
      </div>
    </>
  );
}

function Holder() {
  const { subject } = useParams();
  const {
    advertisers = [],
    mains = [],
    profiles,
    error,
    targetOrigin,
  } = useProfiles();
  if (error) {
    return (
      <ErrorPlaceholder>
        <p className="whitespace-pre-wrap">{error.message}</p>
      </ErrorPlaceholder>
    );
  }
  if (!profiles) {
    return (
      <LoadingPlaceholder>
        <p>
          {targetOrigin && `${targetOrigin} の`}
          プロファイルを取得検証しています...
        </p>
      </LoadingPlaceholder>
    );
  }
  const profile = profiles.find((profile) => profile.subject === subject);
  if (!profile || !isOp(profile)) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  const holder = profile.item.find(isHolder);
  if (!holder) {
    return (
      <ErrorPlaceholder>
        <p>所有者情報が見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  const roles = toRoles(profile.subject, advertisers, mains);
  return <Page op={profile} holder={holder} roles={roles} />;
}

export default Holder;
