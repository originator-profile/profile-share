import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  Advertisement,
  OgWebsite,
  OpCertifier,
  OpHolder,
} from "@originator-profile/model";
import { isAdvertisement, isDp, isOpCertifier } from "@originator-profile/core";
import {
  Image,
  TechInfo,
  WebsiteMainTable,
  Modal,
  Description,
} from "@originator-profile/ui";
import { Profile, Op, Dp } from "@originator-profile/ui/src/types";
import placeholderLogoMainUrl from "@originator-profile/ui/src/assets/placeholder-logo-main.png";
import HolderSummary from "../components/HolderSummary";
import DpSelector from "../components/DpSelector";
import DpFilter from "../components/DpFilter";
import {
  useModal,
  getContentType,
  sortDps,
} from "@originator-profile/ui/src/utils";
import { routes } from "../utils/routes";

type Props = {
  article?: {
    profiles: Profile[];
    main: string[];
    op: Op;
    dp: Dp;
    dpItemContent: OgWebsite | Advertisement;
    holder: OpHolder;
    paths: {
      org: {
        pathname: string;
        search: string;
      };
    };
    filteredDps: Dp[];
  };
  website?: {
    op: Op;
    dp: Dp;
    website: OgWebsite;
    holder: OpHolder;
    paths: {
      org: {
        pathname: string;
        search: string;
      };
    };
  };
};

function Site({ op, dp, website, holder, paths }: Required<Props>["website"]) {
  const certifiers = new Map<string, OpCertifier>(
    op.item.filter(isOpCertifier).map((c) => [c.domainName, c]),
  );
  const techTableModal = useModal<{ op: Op; dp: Dp }>();
  const handleClick = () => techTableModal.onOpen({ op, dp });
  return (
    <div className="bg-gray-50 p-4">
      <div>
        <div className="flex justify-center">
          <Modal open={techTableModal.open} onClose={techTableModal.onClose}>
            {techTableModal.value && (
              <TechInfo
                className="rounded-b-none"
                op={techTableModal.value.op}
                dp={techTableModal.value.dp}
                holder={holder.name}
                certifier={certifiers.get(op.issuer)?.name}
              />
            )}
          </Modal>
          <p className="jumpu-badge bg-gray-600 text-xs text-white font-normal border border-gray-300 mb-3">
            サイト
          </p>
          <button
            className="jumpu-icon-button text-xs rounded-full bg-gray-100 border-gray-200 w-6 h-6 ml-1"
            onClick={handleClick}
          >
            <Icon className="inline" icon={"fa6-solid:wrench"} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Image
            className="flex-shrink-0 w-fit bg-white"
            src={website.image}
            placeholderSrc={placeholderLogoMainUrl}
            alt=""
            width={80}
            height={45}
          />
          <h1 className="w-fit text-base text-gray-700 mb-2">
            {website.title}
          </h1>
          <div className="flex flex-col items-center mb-3">
            <p className="text-base font-bold text-primary-800">
              このサイトの運営者には信頼性情報があります
            </p>
            <p className="text-primary-700 py-1">
              <Icon
                className="inline w-3 h-3 mr-1"
                icon={"material-symbols:help"}
              />
              信頼性情報について
            </p>
          </div>
        </div>
        <div className="mb-3" data-testid="pp-json-holder">
          <HolderSummary to={paths.org} holder={holder} />
        </div>
      </div>
    </div>
  );
}

function Main({
  op,
  dp,
  main,
  dpItemContent,
  holder,
  paths,
}: Required<Props>["article"]) {
  const certifiers = new Map<string, OpCertifier>(
    op.item.filter(isOpCertifier).map((c) => [c.domainName, c]),
  );

  const techTableModal = useModal<{ op: Op; dp: Dp }>();
  const contentType = getContentType(dp, dpItemContent, main);
  const handleClick = () => techTableModal.onOpen({ op, dp });
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div>
        <Modal open={techTableModal.open} onClose={techTableModal.onClose}>
          {techTableModal.value && (
            <TechInfo
              className="rounded-b-none"
              op={techTableModal.value.op}
              dp={techTableModal.value.dp}
              holder={holder.name}
              certifier={certifiers.get(op.issuer)?.name}
            />
          )}
        </Modal>
        <div className="flex items-center gap-1 mb-3">
          <p className="jumpu-badge inline-flex items-center gap-1 bg-gray-600 text-xs text-white font-normal border border-gray-300">
            {contentType === "メインコンテンツ" && (
              <Icon className="text-base" icon="fluent:window-text-20-filled" />
            )}
            {contentType}
          </p>
          <button
            className="jumpu-icon-button text-xs rounded-full bg-gray-100 border-gray-200 w-6 h-6 ml-1"
            onClick={handleClick}
          >
            <Icon className="inline" icon={"fa6-solid:wrench"} />
          </button>
        </div>
        <div className="mb-3">
          <p className="text-base font-bold text-primary-800">
            {`この${contentType}の発行者には信頼性情報があります`}
          </p>
          <p className="text-primary-700 py-1">
            <Icon
              className="inline w-3 h-3 mr-1"
              icon={"material-symbols:help"}
            />
            信頼性情報について
          </p>
        </div>
        <div className="mb-3" data-testid="ps-json-holder">
          <HolderSummary to={paths.org} holder={holder} />
        </div>
        <hr className="mb-3" />
        <div className="flex flex-row gap-3 mb-2">
          <Image
            className="flex-shrink-0 bg-white rounded-md"
            src={dpItemContent.image}
            placeholderSrc={placeholderLogoMainUrl}
            alt=""
            width={120}
            height={80}
          />
          <div>
            <p className="text-sm text-gray-900 font-bold">
              {dpItemContent.title}
            </p>
          </div>
        </div>
        {dpItemContent.type === "website" && (
          <WebsiteMainTable
            className="mb-1 w-full"
            website={dpItemContent}
          />
        )}
        {dpItemContent.description && (
          <Description description={dpItemContent.description} />
        )}
      </div>
    </div>
  );
}

function Publ(props: Props) {
  const [contentType, setContentType] = useState<
    "advertisement" | "main" | "all" | "other"
  >("all");

  const filterFunction =
    (contentType: "advertisement" | "main" | "all" | "other") => (dp: Dp) => {
      switch (contentType) {
        case "all":
          return true;
        case "main":
          return props.article?.main.includes(dp.subject);
        case "other":
          return (
            !props.article?.main.includes(dp.subject) &&
            !dp.item.some(isAdvertisement)
          );
        case "advertisement":
          return dp.item.some(isAdvertisement);
      }
    };

  const filteredDps = sortDps(
    props.article?.profiles.filter(isDp).filter(filterFunction(contentType)) ??
      [],
    props.article?.main ?? [],
  );

  const { tabId } = useParams<{ tabId: string }>();
  const navigate = useNavigate();

  function onFilterUpdate(
    contentType: "advertisement" | "main" | "all" | "other",
  ) {
    setContentType(contentType);
    const filteredDps = sortDps(
      props.article?.profiles
        .filter(isDp)
        .filter(filterFunction(contentType)) ?? [],
      props.article?.main ?? [],
    );
    const dp = filteredDps[0];
    if (dp) {
      navigate(
        [
          routes.base.build({ tabId: String(tabId) }),
          routes.publ.build(dp),
        ].join("/"),
      );
    }
  }

  return (
    <div>
      {props.website && (
        <header className="border-b border-gray-200">
          <Site {...props.website} />
        </header>
      )}
      {props.article && (
        <div className="flex">
          <div className="flex flex-col border-r border-gray-200">
            <DpFilter
              contentType={contentType}
              setContentType={onFilterUpdate}
            />
            <nav className="flex-shrink-0 w-16 overflow-y-auto bg-white sticky top-0 z-10 border-t border-gray-200">
              <DpSelector filteredDps={filteredDps} />
            </nav>
          </div>
          <main className="flex-1">
            <Main {...props.article}/>
          </main>
        </div>
      )}
    </div>
  );
}

export default Publ;
