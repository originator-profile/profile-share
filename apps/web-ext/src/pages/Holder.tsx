import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import useOpsAtom from "../store/useOpsAtom";
import { isHolder } from "../utils/op";
import Placeholder from "../components/Placeholder";
import Spinner from "../components/Spinner";
import Image from "../components/Image";
import Header from "../components/Header";
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
  const logo = holder.logos?.find(({ isMain }) => isMain);

  return (
    <>
      <Header className="sticky top-0">
        <Link
          css={{
            "[role='tooltip']": {
              transform: "translateX(-50%) translateY(150%) scale(0)",
            },
            "&:hover": {
              "[role='tooltip']": {
                transform: "translateX(-50%) translateY(150%) scale(1)",
              },
            },
          }}
          className="jumpu-icon-button flex-shrink-0"
          to="/"
          aria-describedby="tooltip-back"
        >
          <Icon
            className="text-lg text-gray-700"
            icon="fa6-solid:chevron-left"
          />
          <span id="tooltip-back" role="tooltip">
            戻る
          </span>
        </Link>
      </Header>
      <Image
        src={logo?.url}
        placeholderSrc="/assets/placeholder-logo-main.png"
        alt={`${holder.name}のロゴ`}
        width={320}
        height={198}
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
      {holder.description && (
        <section className="px-3 py-2 border-gray-200 border-b">
          <h2 className="mb-1 text-gray-500 font-normal">説明</h2>
          <div
            className="prose prose-sm"
            dangerouslySetInnerHTML={{
              __html: holder.description,
            }}
          />
        </section>
      )}
    </>
  );
}

export default Holder;
