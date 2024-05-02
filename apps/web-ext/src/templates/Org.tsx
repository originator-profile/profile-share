import { useState } from "react";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import { OpCredential, OpHolder } from "@originator-profile/model";
import {
  HolderTable,
  Description,
  TechTable,
  CredentialSummary,
  CredentialDetail,
  Modal,
  OriginatorProfile,
  Role,
} from "@originator-profile/ui";
import { useModal } from "@originator-profile/ui/src/utils";
import HolderSummary from "../components/HolderSummary";
import BackHeader from "../components/BackHeader";

function Tab(props: React.ComponentProps<"button">) {
  return (
    <button
      className={clsx(
        "text-sm rounded jumpu-button",
        props["aria-selected"] || "bg-white text-gray-600",
        props.className,
      )}
      type="button"
      {...props}
    />
  );
}

function ReliabilityInfo(props: { op: OriginatorProfile }) {
  const credentials = props.op.listCredentialItems();
  const credentialModal = useModal<OpCredential>();
  return (
    <>
      <ul className="mb-4">
        {credentials.map((credential, index) => (
          <li className="mb-2" key={index}>
            <CredentialSummary
              className="w-full"
              credential={credential}
              certifier={props.op.findCertifier(credential.certifier)}
              onClick={credentialModal.onOpen}
            />
          </li>
        ))}
      </ul>
      <Modal open={credentialModal.open} onClose={credentialModal.onClose}>
        {credentialModal.value && (
          <CredentialDetail
            className="rounded-b-none"
            credential={credentialModal.value}
          />
        )}
      </Modal>
    </>
  );
}

function OrgInfo(props: { op: OriginatorProfile; holder: OpHolder }) {
  return (
    <div className="space-y-4">
      {props.holder.description && (
        <Description description={props.holder.description} onlyBody />
      )}
      <section>
        <h2 className="text-xs text-gray-600 font-bold mb-3">組織情報</h2>
        <div className="jumpu-card p-4">
          <HolderTable holder={props.holder} />
        </div>
      </section>
      <section>
        <h2 className="text-xs text-gray-600 font-bold mb-3">技術情報</h2>
        <div className="jumpu-card p-4">
          <TechTable
            className="p-4"
            profile={props.op}
            issuer={props.op.findCertifier(props.op.issuer)?.name}
          />
        </div>
      </section>
    </div>
  );
}

type Props = {
  contentType: string;
  op: OriginatorProfile;
  holder: OpHolder;
  roles: Role[];
  paths: {
    back: {
      pathname: string;
      search: string;
    };
  };
};

function Org({ contentType, op, holder, paths }: Props) {
  const [tab, setTab] = useState<"reliability" | "org">("reliability");
  const handleClick = (value: typeof tab) => () => setTab(value);
  return (
    <article className="bg-gray-50 flex flex-col min-h-dvh">
      <BackHeader className="sticky top-0" to={paths.back}>
        <h1 className="text-sm">{holder.name}</h1>
      </BackHeader>
      <div className="bg-white px-4 border-b border-gray-200">
        <div className="text-center pt-4">
          <p className="text-base font-bold text-primary-800">
            {`この${contentType}の${contentType === "サイト" ? "運営者" : "発行者"}には信頼性情報があります`}
          </p>
          <p className="text-xs text-primary-700 py-2 inline-flex items-center gap-1">
            <Icon
              className="inline w-3 h-3 mr-1"
              icon="material-symbols:help"
            />
            信頼性情報について
          </p>
        </div>
        <div data-testid="ps-json-holder" className="flex justify-center pb-4">
          <HolderSummary holder={holder} />
        </div>
        <div role="tablist" className="grid grid-cols-2 py-3">
          <Tab
            id="reliability-tab"
            role="tab"
            aria-selected={tab === "reliability"}
            aria-controls="reliability-panel"
            onClick={handleClick("reliability")}
          >
            信頼性情報
          </Tab>
          <Tab
            id="org-tab"
            role="tab"
            aria-selected={tab === "org"}
            aria-controls="org-panel"
            onClick={handleClick("org")}
          >
            組織
          </Tab>
        </div>
      </div>
      <div
        id="reliability-panel"
        role="tabpanel"
        aria-labelledby="reliability-tab"
        hidden={tab !== "reliability"}
        className="p-4"
      >
        <ReliabilityInfo op={op} />
      </div>
      <div
        id="org-panel"
        role="tabpanel"
        aria-labelledby="org-tab"
        hidden={tab !== "org"}
        className="p-4"
      >
        <OrgInfo op={op} holder={holder} />
      </div>
    </article>
  );
}

export default Org;
