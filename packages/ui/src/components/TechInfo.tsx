import { twMerge } from "tailwind-merge";
import { OriginatorProfile, DocumentProfile, _ } from "../utils";
import TechTable from "./TechTable";

type Props = {
  className?: string;
  op: OriginatorProfile;
  dp: DocumentProfile;
  holder?: string;
  certifier?: string;
};

function TechInfo({ className, op, dp, holder, certifier }: Props) {
  return (
    <div className={twMerge("jumpu-card p-5 rounded-2xl text-sm", className)}>
      <p className="text-base font-bold mb-3">{_("TechInfo_TechInfo")}</p>
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
