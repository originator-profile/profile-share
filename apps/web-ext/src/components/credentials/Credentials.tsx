import { Icon } from "@iconify/react";
import { AdvertisementCA, ArticleCA } from "@originator-profile/model";
import {
  ArticleTable,
  Description,
  Image,
  Modal,
  TechInfo,
  _,
  useModal,
} from "@originator-profile/ui";
import placeholderLogoMainUrl from "@originator-profile/ui/src/assets/placeholder-logo-main.png";
import { VerifiedCas, VerifiedOps } from "@originator-profile/verify";
import flush from "just-flush";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { buildPublUrl } from "../../utils/routes";
import CaFilter from "../CaFilter";
import CaSelector from "../CaSelector";
import ReliabilityGuide from "../ReliabilityGuide";
import WebMediaProfileSummaryCard from "../WebMediaProfileSummaryCard";
import { overlayExtensionMessenger } from "../overlay/extension-events";
import { BidResponse } from "../rtb";
import { listCas } from "./cas";
import { getContentType } from "./get-content-type";
import { CredentialsProps, SupportedVerifiedCa } from "./types";

export function Credentials(props: CredentialsProps) {
  const [caListType, setCaListType] =
    useState<Parameters<typeof listCas>[1]>("Article");
  const { tabId } = useParams<{ tabId: string }>();

  const techInfoModal = useModal<{
    ops: VerifiedOps;
    cas: VerifiedCas;
  }>();
  const handleClickTechInfo = () =>
    techInfoModal.onOpen({ ops: props.ops, cas: props.cas });
  const navigate = useNavigate();

  const filteredCas = listCas(props.cas, caListType);

  function onFilterUpdate(caListType: Parameters<typeof listCas>[1]) {
    setCaListType(caListType);
    const newlyFilteredCas = listCas(props.cas, caListType);
    const [ca] = newlyFilteredCas;
    if (ca) {
      void navigate(buildPublUrl(tabId, ca.attestation.doc));
    }
  }

  const handleClickCa = async (ca: SupportedVerifiedCa) => {
    void overlayExtensionMessenger.sendMessage(
      "enter",
      {
        cas: props.cas,
        activeCa: ca,
        wmps: flush(props.ops.map((op) => op.media?.doc)),
      },
      Number(tabId),
    );
  };

  const contentType = getContentType(props.ca);
  const ca = props.ca.attestation.doc;

  return (
    <div data-testid="cas" className="flex">
      <div className="flex flex-col border-r border-gray-200">
        <CaFilter caListType={caListType} setCaListType={onFilterUpdate} />
        <nav className="flex-shrink-0 w-16 overflow-y-auto bg-white sticky top-0 z-10 border-t border-gray-200">
          <CaSelector filteredCas={filteredCas} onClickCa={handleClickCa} />
        </nav>
      </div>
      <main className="flex-1">
        <div className="bg-gray-100 min-h-screen p-4">
          <div>
            <Modal open={techInfoModal.open} onClose={techInfoModal.onClose}>
              {techInfoModal.value && (
                <TechInfo
                  className="rounded-b-none max-h-[80svh] overflow-auto"
                  value={{
                    ops: techInfoModal.value.ops,
                    cas: techInfoModal.value.cas,
                  }}
                />
              )}
            </Modal>
            <div className="flex items-center justify-center gap-1 mb-3">
              <p className="whitespace-pre-line jumpu-badge inline-flex items-center gap-1 bg-gray-600 text-xs text-white font-normal border border-gray-300">
                {contentType === "ContentType_Main" && (
                  <Icon
                    className="text-base"
                    icon="fluent:window-text-20-filled"
                  />
                )}
                {_(contentType)}
              </p>
              <button
                className="jumpu-icon-button text-xs rounded-full bg-gray-100 border-gray-200 w-6 h-6 ml-1 group"
                aria-describedby="tooltip-2"
                onClick={handleClickTechInfo}
              >
                <Icon className="inline" icon={"fa6-solid:wrench"} />
                <span
                  id="whitespace-pre-line tooltip-2"
                  role="tooltip"
                  className="whitespace-pre-line ![transform:translate(-50%,_150%)_scale(0)] group-hover:![transform:translate(-50%,_150%)_scale(1)]"
                >
                  {_("Credentials_TechnicalInformation")}
                </span>
              </button>
            </div>
            <ReliabilityGuide className="mb-3" contentType={contentType} />
            <div className="mb-3" data-testid="ps-json-holder">
              <WebMediaProfileSummaryCard to={props.orgPath} wmp={props.wmp} />
            </div>
            <hr className="mb-3" />
            <div className="flex flex-row gap-3 mb-2">
              <Image
                className="flex-shrink-0 bg-white rounded-md"
                src={ca.credentialSubject.image?.id}
                placeholderSrc={placeholderLogoMainUrl}
                alt=""
                width={120}
                height={80}
              />
              <div>
                <p className="text-sm text-gray-900 font-bold">
                  {ca.credentialSubject.type === "Article"
                    ? ca.credentialSubject.headline
                    : ca.credentialSubject.name}
                </p>
              </div>
            </div>
            {ca.credentialSubject.type === "Article" && (
              <ArticleTable className="mb-1 w-full" article={ca as ArticleCA} />
            )}
            {ca.credentialSubject.description && (
              <Description description={ca.credentialSubject.description} />
            )}
            {ca.credentialSubject.type === "OnlineAd" && (
              <BidResponse
                className="w-full py-1"
                tabId={Number(tabId)}
                advertisement={ca as AdvertisementCA}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
