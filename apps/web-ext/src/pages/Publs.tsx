import useProfileSet from "../utils/use-profile-set";
import Template from "../templates/Publs";

function Publs() {
  const { main = [], profiles = [] } = useProfileSet();
  return <Template profiles={profiles} main={main} />;
}

export default Publs;
