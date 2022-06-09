import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { isOp } from "../utils/op";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/Certifier";

type Props = {
  nested?: boolean;
};

type RouteProps = Omit<Parameters<typeof Template>[0], "paths">;

function NestedRoute(props: RouteProps) {
  const params = useParams();
  const paths = {
    back: routes.nestedHolder.build(params),
  } as const;
  return <Template {...props} paths={paths} />;
}

function Route(props: RouteProps) {
  const params = useParams();
  const paths = {
    back: routes.holder.build(params),
  };
  return <Template {...props} paths={paths} />;
}

function Certifier({ nested = false }: Props) {
  const { subject } = useParams();
  const { profiles, error, targetOrigin } = useProfiles();
  if (error) {
    return (
      <ErrorPlaceholder>
        <p>{error.message}</p>
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
  if (nested) return <NestedRoute op={profile} />;
  return <Route op={profile} />;
}

export default Certifier;
