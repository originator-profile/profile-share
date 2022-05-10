import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import useOpsAtom from "../store/useOpsAtom";
import { isHolder } from "../utils/op";
import Placeholder from "../components/Placeholder";
import Spinner from "../components/Spinner";
import HolderTable from "../components/HolderTable";

function Holder(): React.ReactElement {
  const { subject } = useParams();
  const { ops } = useOpsAtom();
  if (ops.length === 0) {
    return (
      <Placeholder>
        <Spinner />
      </Placeholder>
    );
  }
  const op = ops.find((op) => op.subject === subject);
  if (!op) {
    return (
      <Placeholder>
        <p>プロファイルが見つかりませんでした</p>
      </Placeholder>
    );
  }
  const holder = op.item.find(isHolder);
  if (!holder) {
    return (
      <Placeholder>
        <p>所有者情報が見つかりませんでした</p>
      </Placeholder>
    );
  }
  const logo = holder.logo?.find(({ isMain }) => isMain);

  return (
    <>
      <img
        className="w-full"
        src={logo?.url ?? "/assets/placeholder-logo-main.png"}
        alt={`${holder.name}のロゴ`}
        width={640}
        height={396}
      />
      <div className="px-3 py-3">
        <p className="mb-1 text-success flex items-center">
          <Icon
            className="mr-1 text-base"
            icon="akar-icons:circle-check-fill"
          />
          検証済み
        </p>
        <p className="jumpu-tag hover:border-transparent cursor-auto text-sm bg-gray-100">
          コンテンツを出版しています
        </p>
      </div>
      <hr className="border-gray-50 border-4" />
      <HolderTable className="w-full" holder={holder} />
    </>
  );
}

export default Holder;
