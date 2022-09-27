import { isDp, isOp, isOpHolder } from "@webdino/profile-core";
import { Profile, Dp, Op } from "../types/profile";
import DpMarker from "../components/DpMarker";

function DpMapFragment({
  dp,
  activeDp,
  ops,
  onClickDp,
}: {
  dp: Dp;
  activeDp: Dp | null;
  ops: Op[];
  onClickDp: (dp: Dp) => void;
}) {
  const op = ops.find((op) => op.subject === dp.issuer);
  const opHolder = op?.item.find(isOpHolder);
  if (!opHolder) return null;
  const active = Boolean(
    activeDp && activeDp.issuer === dp.issuer && activeDp.subject === dp.subject
  );
  return (
    <DpMarker
      dp={dp}
      opHolder={opHolder}
      active={active}
      onClickDp={onClickDp}
    />
  );
}

type Props = {
  profiles: Profile[];
  activeDp: Dp | null;
  onClickDp: (dp: Dp) => void;
};

function DpMap({ profiles, activeDp, onClickDp }: Props) {
  const dps = profiles.filter(isDp);
  const ops = profiles.filter(isOp);
  return (
    <>
      {dps.map((dp) => (
        <DpMapFragment
          key={`${encodeURIComponent(dp.issuer)}/${encodeURIComponent(
            dp.subject
          )}`}
          dp={dp}
          activeDp={activeDp}
          ops={ops}
          onClickDp={onClickDp}
        />
      ))}
    </>
  );
}

export default DpMap;
