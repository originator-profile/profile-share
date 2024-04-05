import useProfileSet from "../utils/use-profile-set";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import Template from "../templates/Prohibition";
import Unsupported from "../components/Unsupported";

function Prohibition() {
  const { tabId, error, profileSet } = useProfileSet();
  if (error) {
    return <Unsupported error={error} />;
  }

  if (profileSet.isLoading) {
    return <Loading />;
  }

  const dp = profileSet.dps[0];
  if (!dp) {
    return <NotFound variant="dp" />;
  }
  return <Template dp={dp} tabId={tabId} />;
}

export default Prohibition;
