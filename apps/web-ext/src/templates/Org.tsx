import { Icon } from "@iconify/react";
import { OgWebsite, OpCredential, OpHolder } from "@originator-profile/model";
import {
  CredentialDetail,
  CredentialSummary,
  Description,
  HolderTable,
  Modal,
  OriginatorProfile,
  Role,
  TechTable,
  _,
  useModal,
} from "@originator-profile/ui";
import clsx from "clsx";
import { useState } from "react";
import BackHeader from "../components/BackHeader";
import HolderSummary from "../components/HolderSummary";
import ReliabilityGuide from "../components/ReliabilityGuide";

function ExternalLink(props: React.ComponentProps<"a">) {
  return (
    <a
      className={clsx(
        "jumpu-card flex items-center gap-2.5 px-3 py-5 text-sm hover:bg-blue-50",
        props.className,
      )}
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      <span>{props.children}</span>
      <Icon
        className="text-gray-500"
        icon="fa6-solid:arrow-up-right-from-square"
      />
    </a>
  );
}

function ReliabilityInfo(props: { op: OriginatorProfile; holder: OpHolder }) {
  const credentials = props.op.listCredentialItems();
  const credentialModal = useModal<OpCredential>();
  return (
    <div className="space-y-4">
      {props.holder.publishingPrincipleUrl && (
        <section>
          <h2 className="whitespace-pre-line text-xs text-gray-600 mb-3">
            {_("Org_EditorialGuidelines")}
          </h2>
          <ExternalLink href={props.holder.publishingPrincipleUrl}>
            {props.holder.publishingPrincipleTitle ??
              props.holder.publishingPrincipleUrl}
          </ExternalLink>
        </section>
      )}
      {props.holder.privacyPolicyUrl && (
        <section>
          <h2 className="whitespace-pre-line text-xs text-gray-600 mb-3">
            {_("Org_PrivacyPolicy")}
          </h2>
          <ExternalLink href={props.holder.privacyPolicyUrl}>
            {props.holder.privacyPolicyTitle ?? props.holder.privacyPolicyUrl}
          </ExternalLink>
        </section>
      )}
      <section>
        <h2 className="whitespace-pre-line text-xs text-gray-600 mb-3">
          {_("Org_CredentialInformation")}
        </h2>
        <ul className="space-y-2">
          {credentials.map((credential, index) => (
            <li key={index}>
              <CredentialSummary
                className="w-full"
                credential={credential}
                certifier={props.op.findCertifier(credential.certifier)}
                onClick={credentialModal.onOpen}
              />
            </li>
          ))}
        </ul>
      </section>
      <Modal open={credentialModal.open} onClose={credentialModal.onClose}>
        {credentialModal.value && (
          <CredentialDetail
            className="rounded-b-none"
            credential={credentialModal.value}
          />
        )}
      </Modal>
    </div>
  );
}

function OrgInfo(props: { op: OriginatorProfile; holder: OpHolder }) {
  return (
    <div className="space-y-4">
      {props.holder.description && (
        <Description description={props.holder.description} onlyBody />
      )}
      <section>
        <h2 className="whitespace-pre-line text-xs text-gray-600 mb-3">
          {_("Org_OrganizationInformation")}
        </h2>
        <div className="jumpu-card p-4">
          <HolderTable holder={props.holder} />
        </div>
      </section>
      <section>
        <h2 className="whitespace-pre-line text-xs text-gray-600 mb-3">
          {_("Org_TechnicalInformation")}
        </h2>
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

type Tabs = {
  id: string;
  name: string;
  panel: React.ReactNode;
}[];

function useTabs(tabs: Tabs) {
  const [activeTab, setActiveTab] = useState<
    (typeof tabs)[number]["id"] | null
  >(tabs[0]?.id ?? null);
  const handleClick = (value: typeof activeTab) => () => setActiveTab(value);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const index = tabs.findIndex(({ id }) => id === activeTab);
    let nextTab: (typeof tabs)[number] | undefined;
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        nextTab = tabs.at(index + 1) ?? tabs.at(0);
        break;
      case "ArrowLeft":
        event.preventDefault();
        nextTab = tabs.at(index - 1);
        break;
      case "Home":
        event.preventDefault();
        nextTab = tabs.at(0);
        break;
      case "End":
        event.preventDefault();
        nextTab = tabs.at(-1);
        break;
    }
    if (!nextTab) return;
    setActiveTab(nextTab.id);
  };
  const handleRef: React.RefCallback<HTMLButtonElement> = (node) => {
    if (node?.ariaSelected === "true") node.focus();
  };

  return {
    activeTab,
    handleClick,
    handleKeyDown,
    handleRef,
  };
}

type Props = {
  contentType: string;
  site?: OgWebsite;
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

function Org({ contentType, site, op, holder, paths }: Props) {
  const tabs = [
    {
      id: "reliability",
      name: _("Org_ReliabilityInformation"),
      panel: <ReliabilityInfo op={op} holder={holder} />,
    },
    {
      id: "org",
      name: _("Org_OrganizationInformation"),
      panel: <OrgInfo op={op} holder={holder} />,
    },
  ] as const satisfies Tabs;
  const { activeTab, ...handlers } = useTabs(tabs);
  return (
    <article className="bg-gray-50 flex flex-col min-h-dvh">
      <BackHeader className="sticky top-0 z-10" to={paths.back}>
        <h1 className="text-sm">{site?.title}</h1>
      </BackHeader>
      <div className="bg-white px-4 border-b border-gray-200">
        <ReliabilityGuide className="pt-4 pb-2" contentType={contentType} />
        <div data-testid="ps-json-holder" className="flex justify-center pb-4">
          <HolderSummary holder={holder} />
        </div>
        <div role="tablist" className="grid grid-cols-2 gap-0.5 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`${tab.id}-tab`}
              className={clsx(
                "text-sm rounded jumpu-button",
                activeTab !== tab.id && "bg-white text-gray-600",
              )}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={handlers.handleClick(tab.id)}
              onKeyDown={handlers.handleKeyDown}
              type="button"
              ref={handlers.handleRef}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${tab.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${tab.id}-tab`}
          hidden={activeTab !== tab.id}
          className="p-4"
        >
          {tab.panel}
        </div>
      ))}
    </article>
  );
}

export default Org;
