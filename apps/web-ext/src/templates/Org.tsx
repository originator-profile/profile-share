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
    <>
      <h2 className="text-sm text-gray-600 font-bold mb-3">所有者情報</h2>
      <div className="jumpu-card p-4 mb-4">
        <HolderTable holder={props.holder} />
        {props.holder.description && (
          <Description description={props.holder.description} />
        )}
      </div>
      <h2 className="text-sm text-gray-600 font-bold mb-3">技術情報</h2>
      <div className="jumpu-card p-4">
        <TechTable
          className="p-4"
          profile={props.op}
          issuer={props.op.findCertifier(props.op.issuer)?.name}
        />
      </div>
    </>
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
  return (
    <>
      <BackHeader className="sticky top-0" to={paths.back}>
        <h1 className="text-sm">{holder.name}</h1>
      </BackHeader>
      <div className="bg-white p-4 pb-2">
        <div className="gap-0.5">
          <p className="text-base font-bold text-primary-800">
            {`この${contentType}の${contentType === "サイト" ? "運営者" : "発行者"}には信頼性情報があります`}
          </p>
          <p className="text-xss text-primary-700 py-2 gap-1">
            <Icon
              className="inline w-3 h-3 mr-1"
              icon="material-symbols:help"
            />
            信頼性情報について
          </p>
        </div>
        <div className="mb-3" data-testid="ps-json-holder">
          <HolderSummary holder={holder} />
        </div>
      </div>
      <ReliabilityInfo op={op} />
      <OrgInfo op={op} holder={holder} />
    </>
  );
}

export default Org;
