import useOps from "../utils/use-ops";
import { Op } from "../types/op";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import ProfileItem from "../components/ProfileItem";

function Page({ ops }: { ops: Op[] }) {
  return (
    <>
      {ops.map((op, index) => (
        <ProfileItem
          key={op.subject}
          op={op}
          variant={index === 0 ? "primary" : "secondary"}
        />
      ))}
    </>
  );
}

function Holders() {
  const { ops, error, targetOrigin } = useOps();
  if (error) {
    return (
      <ErrorPlaceholder>
        <p className="whitespace-pre-wrap">{error.message}</p>
      </ErrorPlaceholder>
    );
  }
  if (!ops) {
    return (
      <LoadingPlaceholder>
        <p>
          {targetOrigin && `${targetOrigin} の`}
          プロファイルを取得検証しています...
        </p>
      </LoadingPlaceholder>
    );
  }
  return <Page ops={ops} />;
}

export default Holders;
