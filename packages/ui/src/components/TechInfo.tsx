import { Profile } from "../types/profile";
import TechTable from "./TechTable";
import clsx from "clsx";

type Props = {
  className?: string;
  op: Profile;
  dp: Profile;
  holder?: string;
  certifier?: string;
};

function TechInfo({ className, op, dp, holder, certifier }: Props) {
  return (
    <div className={clsx("jumpu-card p-5 rounded-2xl text-sm", className)}>
      <p className="text-base font-bold mb-3">技術情報</p>
      <div className="mb-3">
        <p className="text-base font-bold mb-1">OP</p>
        <TechTable profile={op} issuer={certifier} />
      </div>
      <div>
        <p className="text-base font-bold mb-1">DP</p>
        <TechTable profile={dp} issuer={holder} />
      </div>
    </div>
  );
}

export default TechInfo;
