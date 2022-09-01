import useProfiles from "../utils/use-profiles";
import Template from "../templates/Publs";

function Publs() {
  const { main = [], profiles = [] } = useProfiles();
  return <Template profiles={profiles} main={main} />;
}

export default Publs;
