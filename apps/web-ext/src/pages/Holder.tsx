import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { isHolder, isOp } from "../utils/op";
import { toRoles } from "../utils/role";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/Holder";

type Props = {
  nested?: boolean;
};

type RouteProps = Omit<Parameters<typeof Template>[0], "paths">;

function NestedRoute(props: RouteProps) {
  const params = useParams();
  const paths = {
    back: routes.website.build({
      issuer: params.nestedIssuer,
      subject: params.nestedSubject,
    }),
    certifier: routes.nestedCertifier.build(params),
    technicalInformation: routes.nestedTechnicalInformation.build(params),
  } as const;
  return <Template {...props} paths={paths} />;
}

function Route(props: RouteProps) {
  const params = useParams();
  const paths = {
    back: routes.profiles.build(params),
    certifier: routes.certifier.build(params),
    technicalInformation: routes.technicalInformation.build(params),
  } as const;
  return <Template {...props} paths={paths} />;
}

function Holder({ nested = false }: Props) {
  const { subject } = useParams();
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
  if (nested) return <NestedRoute op={profile} holder={holder} roles={roles} />;
  return <Route op={profile} holder={holder} roles={roles} />;
}

export default Holder;
