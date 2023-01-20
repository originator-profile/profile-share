import useProfiles from "../utils/use-profiles";
import Spinner from "./Spinner";

function Loading() {
  const { profileEndpoint } = useProfiles();
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="p-2 flex flex-col items-center gap-4">
        <Spinner />
        <p>
          {profileEndpoint && `${profileEndpoint.origin} の`}
          プロファイルを取得検証しています...
        </p>
      </div>
    </div>
  );
}

export default Loading;
