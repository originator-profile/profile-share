import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { OpHolder, OgWebsite } from "@originator-profile/model";
import { DpItemContent } from "@originator-profile/core";
import {
  Image,
  TechInfo,
  WebsiteMainTable,
  Modal,
  Description,
  ProfileSet,
  OriginatorProfile,
  DocumentProfile,
  useModal,
} from "@originator-profile/ui";
import placeholderLogoMainUrl from "@originator-profile/ui/src/assets/placeholder-logo-main.png";
import HolderSummaryCard from "../components/HolderSummaryCard";
import DpSelector from "../components/DpSelector";
import DpFilter from "../components/DpFilter";
import ReliabilityGuide from "../components/ReliabilityGuide";
import { BidResponse } from "../components/rtb";
import { buildPublUrl } from "../utils/routes";
import { _ } from "@originator-profile/ui/src/utils";

type Props = {
  profiles: ProfileSet;
  article?: {
    op: OriginatorProfile;
    dp: DocumentProfile;
    dpItemContent: DpItemContent;
    holder: OpHolder;
    paths: {
      org: {
        pathname: string;
        search: string;
      };
    };
  };
  website?: {
    op: OriginatorProfile;
    dp: DocumentProfile;
    dpItemContent: OgWebsite;
    holder: OpHolder;
    paths: {
      org: {
        pathname: string;
        search: string;
      };
    };
  };
  handleClickDp: (dp: DocumentProfile) => () => void;
};

function Site({
  op,
  dp,
  dpItemContent,
  holder,
  paths,
}: Required<Props>["website"]) {
  const techTableModal = useModal<{
    op: OriginatorProfile;
    dp: DocumentProfile;
  }>();
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
                certifier={op.findCertifier(op.issuer)?.name}
              />
            )}
          </Modal>
          <p className="whitespace-pre-line jumpu-badge bg-gray-600 text-xs text-white font-normal border border-gray-300 mb-3">
            {_("ContentType_Site")}
          </p>
          <button
            className="jumpu-icon-button text-xs rounded-full bg-gray-100 border-gray-200 w-6 h-6 ml-1 group"
            aria-describedby="tooltip-1"
            onClick={handleClick}
          >
            <Icon className="inline" icon={"fa6-solid:wrench"} />
            <span
              id="tooltip-1"
              role="tooltip"
              className="whitespace-pre-line ![transform:translate(-50%,_150%)_scale(0)] group-hover:![transform:translate(-50%,_150%)_scale(1)]"
            >
              {_("PublSite_TechnicalInformation")}
            </span>
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          {dpItemContent.image && (
            <Image
              className="flex-shrink-0 w-fit"
              src={dpItemContent.image}
              placeholderSrc={placeholderLogoMainUrl}
              alt=""
              width={240}
              height={44}
            />
          )}
          <h1 className="w-fit text-base text-gray-700 mb-2">
            {dpItemContent.title}
          </h1>
          <ReliabilityGuide className="mb-3" contentType="ContentType_Site" />
        </div>
        <div className="mb-3" data-testid="pp-json-holder">
          <HolderSummaryCard to={paths.org} holder={holder} />
        </div>
      </div>
    </div>
  );
}

function Main({
  op,
  dp,
  dpItemContent,
  holder,
  paths,
}: Required<Props>["article"]) {
  const { tabId } = useParams<{ tabId: string }>();

  const techTableModal = useModal<{
    op: OriginatorProfile;
    dp: DocumentProfile;
  }>();
  const contentType = dp.getContentType();
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
              certifier={op.findCertifier(op.issuer)?.name}
            />
          )}
        </Modal>
        <div className="flex items-center justify-center gap-1 mb-3">
          <p className="whitespace-pre-line jumpu-badge inline-flex items-center gap-1 bg-gray-600 text-xs text-white font-normal border border-gray-300">
            {contentType === "ContentType_MainContent" && (
              <Icon className="text-base" icon="fluent:window-text-20-filled" />
            )}
            {_(contentType)}
          </p>
          <button
            className="jumpu-icon-button text-xs rounded-full bg-gray-100 border-gray-200 w-6 h-6 ml-1"
            aria-describedby="tooltip-2"
            onClick={handleClick}
          >
            <Icon className="inline" icon={"fa6-solid:wrench"} />
            <span id="whitespace-pre-line tooltip-2" role="tooltip">
              {_("PublMain_TechnicalInformation")}
            </span>
          </button>
        </div>
        <ReliabilityGuide className="mb-3" contentType={contentType} />
        <div className="mb-3" data-testid="ps-json-holder">
          <HolderSummaryCard to={paths.org} holder={holder} />
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
          <WebsiteMainTable className="mb-1 w-full" website={dpItemContent} />
        )}
        {dpItemContent.description && (
          <Description description={dpItemContent.description} />
        )}
        {dpItemContent.type === "advertisement" && (
          <BidResponse className="w-full py-1" tabId={Number(tabId)} dp={dp} />
        )}
      </div>
    </div>
  );
}

function Publ(props: Props) {
  const [contentType, setContentType] = useState<
    "advertisement" | "main" | "all" | "other"
  >("all");
  const { tabId } = useParams<{ tabId: string }>();
  const navigate = useNavigate();

  const filteredDps = props.profiles.listDpsByType(contentType);

  function onFilterUpdate(
    contentType: "advertisement" | "main" | "all" | "other",
  ) {
    setContentType(contentType);
    const NewlyFilteredDps = props.profiles.listDpsByType(contentType);
    const dp = NewlyFilteredDps[0];
    if (dp) {
      navigate(buildPublUrl(tabId, dp));
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
              <DpSelector
                filteredDps={filteredDps}
                handleClickDp={props.handleClickDp}
              />
            </nav>
          </div>
          <main className="flex-1">
            <Main {...props.article} />
          </main>
        </div>
      )}
    </div>
  );
}

export default Publ;
