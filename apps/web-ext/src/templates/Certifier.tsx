import { Op } from "../types/op";
import { Paths } from "../types/routes";
import Image from "../components/Image";
import BackHeader from "../components/BackHeader";
import CertifierTable from "../components/CertifierTable";

type Props = {
  op: Op;
  paths: Paths;
};

function Certifier({ op, paths }: Props) {
  return (
    <>
      <BackHeader className="sticky top-0" to={paths.back}>
        <h1 className="text-sm">認証機関</h1>
      </BackHeader>
      <Image
        src="/assets/logo-certifier.png"
        placeholderSrc="/assets/placeholder-logo-main.png"
        alt="第三者認証機関のロゴ"
        width={320}
        height={198}
      />
      <hr className="border-gray-50 border-4" />
      <CertifierTable className="w-full table-fixed" op={op} />
    </>
  );
}

export default Certifier;
