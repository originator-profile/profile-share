import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { isOp } from "../utils/op";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/TechnicalInformation";

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
    back: isOp(props.profile)
      ? routes.holder.build(params)
      : routes.website.build(params),
  } as const;
  return <Template {...props} paths={paths} />;
}

function TechnicalInformation({ nested }: Props) {
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
  if (!profile) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  if (nested)
    return <NestedRoute profile={profile} targetOrigin={targetOrigin} />;
  return <Route profile={profile} targetOrigin={targetOrigin} />;
}

export default TechnicalInformation;
