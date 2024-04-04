import DpMarker from "../components/DpMarker";
import { ProfileSet, DocumentProfile } from "@originator-profile/ui";

function DpMapFragment({
  dp,
  activeDp,
  profileSet,
  onClickDp,
}: {
  dp: DocumentProfile;
  activeDp: DocumentProfile | null;
  profileSet: ProfileSet;
  onClickDp: (dp: DocumentProfile) => void;
}) {
  const op = profileSet.getOp(dp.issuer);
  if (!op) return null;

  const active = Boolean(activeDp && dp.is(activeDp));
  return <DpMarker dp={dp} op={op} active={active} onClickDp={onClickDp} />;
}

type Props = {
  profiles: ProfileSet;
  activeDp: DocumentProfile | null;
  onClickDp: (dp: DocumentProfile) => void;
};

function DpMap({ profiles, activeDp, onClickDp }: Props) {
  const dps = profiles.dps;
  return (
    <>
      {dps.map((dp) => (
        <DpMapFragment
          key={dp.getReactKey()}
          dp={dp}
          activeDp={activeDp}
          profileSet={profiles}
          onClickDp={onClickDp}
        />
      ))}
    </>
  );
}

export default DpMap;
