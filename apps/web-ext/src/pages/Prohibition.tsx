import { useLocation } from "react-router-dom";
import { useState } from "react";
import useProfileSet from "../utils/use-profile-set";
import { isOp, isOpHolder } from "@originator-profile/core";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import Template from "../templates/Prohibition";
import { toRoles } from "@originator-profile/ui/src/utils";

function Prohibition() {
  const [view, setView] = useState("warning");

  const location = useLocation();
  const { advertisers = [], publishers = [], profiles } = useProfileSet();

  if (!profiles) {
    return <Loading />;
  }

  const op = profiles
    .filter(isOp)
    .find(
      (profile) =>
        profile.issuer === "localhost" && profile.subject === "localhost",
    );

  if (!op) {
    return <NotFound variant="op" />;
  }

  const roles = toRoles(op.subject, advertisers, publishers);

  const holder = op.item.find(isOpHolder);
  if (!holder) {
    return <NotFound variant="holder" />;
  }

  const paths = {
    back: location.pathname,
  } as const;

  return (
    <Template
      view={view}
      setView={setView}
      paths={paths}
      op={op}
      holder={holder}
      roles={roles}
    />
  );
}

export default Prohibition;
