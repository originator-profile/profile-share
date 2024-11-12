import { useVersionInfo } from "../utils/versions";

const AppVersion = () => {
  const { data: versionInfo } = useVersionInfo();

  return (
    <div className="text-center mt-4">
      <small>
        Version: {versionInfo?.version}, Migration:{" "}
        {versionInfo?.prismaMigration}, Commit:{" "}
        {versionInfo?.commitHash.slice(0, 7)}
      </small>
    </div>
  );
};

export default AppVersion;
