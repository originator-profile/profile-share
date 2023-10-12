import { useState } from 'react';
import useProfileSet from "../utils/use-profile-set";
import { isDp } from "@originator-profile/core";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import Template from '../templates/Prohibition';
import { sortDps } from "@originator-profile/ui/src/utils";
import Unsupported from "../components/Unsupported";

function Prohibition() {
  const [view, setView] = useState("warning");

  const {
      tabId,
      main = [],
      error,
      profiles,
  } = useProfileSet();

  if (error) {
    return <Unsupported error={error} />;
  }

  if (!profiles) {
    return <Loading />;
  }

  const [dp] = sortDps(profiles.filter(isDp), main);
  if (!dp) {
    return <NotFound variant="dp" />;
  }

  return (
    <Template 
      view={view} 
      setView={setView} 
      dp={dp}
      tabId={tabId}
    />
  );
}

export default Prohibition;
