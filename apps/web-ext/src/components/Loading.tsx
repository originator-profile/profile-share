import useProfileSet from "../utils/use-profile-set";
import { Spinner } from "@originator-profile/ui";
import { _ } from "@originator-profile/ui/src/utils";

function Loading() {
  const { origin } = useProfileSet();
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="p-2 flex flex-col items-center gap-4">
        <Spinner />
        <p className="whitespace-pre-line">
          {_(
            "Loading_RetrievingAndValidatingProfile",
            origin && _("Loading_OfOrigin", origin),
          )}
        </p>
      </div>
    </div>
  );
}

export default Loading;
