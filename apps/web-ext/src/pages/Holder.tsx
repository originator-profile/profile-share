import clsx from "clsx";
import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { isHolder, isOp } from "../utils/op";
import { Op, OpHolder } from "../types/op";
import { Role } from "../types/role";
import { toRoles } from "../utils/role";
import { Paths } from "../types/routes";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Image from "../components/Image";
import BackHeader from "../components/BackHeader";
import VerifySuccessBadge from "../components/VerifySuccessBadge";
import VerifyFailureBadge from "../components/VerifyFailureBadge";
import Roles from "../components/Roles";
import HolderTable from "../components/HolderTable";
import Description from "../components/Description";
import NavLink from "../components/NavLink";

function Page({
  op,
  holder,
  roles,
  paths,
}: {
  op: Op;
  holder: OpHolder;
  roles: Role[];
  paths: Paths;
}) {
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

function Holder() {
  const params = useParams();
  const paths =
    "nestedIssuer" in params
      ? ({
          back: routes.website.toPath(params),
          certifier: routes.nestedCertifier.toPath(params),
          technicalInformation:
            routes.nestedTechnicalInformation.toPath(params),
        } as const)
      : ({
          back: routes.profiles.toPath(params),
          certifier: routes.certifier.toPath(params),
          technicalInformation: routes.technicalInformation.toPath(params),
        } as const);
  const subject =
    "nestedSubject" in params ? params.nestedSubject : params.subject;
  const {
    advertisers = [],
    publishers = [],
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
  const roles = toRoles(profile.subject, advertisers, publishers);
  return <Page op={profile} holder={holder} roles={roles} paths={paths} />;
}

export default Holder;
