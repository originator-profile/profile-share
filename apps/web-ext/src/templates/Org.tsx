import { Icon } from "@iconify/react";
import { OpCredential, OpHolder } from "@originator-profile/model";
import {
  Image,
  Roles,
  HolderTable,
  Description,
  TechTable,
  Table,
  TableRow,
  CredentialSummary,
  CredentialDetail,
  Modal,
  OriginatorProfile,
  Role,
} from "@originator-profile/ui";
import { useModal } from "@originator-profile/ui/src/utils";
import placeholderLogoMainUrl from "@originator-profile/ui/src/assets/placeholder-logo-main.png";
import logomarkUrl from "@originator-profile/ui/src/assets/logomark.svg";
import BackHeader from "../components/BackHeader";

type Props = {
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

function Org({ op, holder, roles, paths }: Props) {
  const logo = op.getMainLogo();
  const credentials = op.listCredentialItems();
  const credentialModal = useModal<OpCredential>();
  return (
    <>
      <BackHeader className="sticky top-0" to={paths.back}>
        <h1 className="text-sm">{holder.name}</h1>
      </BackHeader>
      <div className="bg-gray-50 p-4">
        <Image
          className="mb-2 rounded"
          src={logo?.url}
          placeholderSrc={placeholderLogoMainUrl}
          alt=""
          width={120}
          height={120}
        />
        <h1 className="text-center text-2xl mb-4">{holder.name}</h1>
        {holder.publishingPrincipleUrl && (
          <a
            className="block bg-gray-50 rounded-lg mb-3"
            href={holder.publishingPrincipleUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-sm font-bold text-gray-600 mb-1">
              編集ガイドライン
            </p>
            <p className="text-xs text-blue-600">
              {holder.publishingPrincipleTitle ?? holder.publishingPrincipleUrl}
              <Icon
                className="inline ml-1 text-gray-500"
                icon="fa-solid:external-link-alt"
              />
            </p>
          </a>
        )}
        <Table className="mb-3">
          <TableRow header="組織情報の発行日" data={op.printIssuedAt()} />
        </Table>
        {roles.length > 0 && <Roles className="mb-3" roles={roles} />}
        <div className="inline-flex items-center gap-2 bg-blue-50 px-2 py-1 mb-3 rounded-sm">
          <img src={logomarkUrl} alt="" width={16} height={14} />
          <p className="flex-1 text-blue-500 text-xs font-bold">
            この組織は認証を受けています
          </p>
        </div>
        <ul className="mb-4">
          {credentials.map((credential, index) => (
            <li className="mb-2" key={index}>
              <CredentialSummary
                className="w-full"
                credential={credential}
                holder={holder}
                certifier={op.findCertifier(credential.certifier)}
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
              holder={holder}
              certifier={op.findCertifier(credentialModal.value.certifier)}
              verifier={op.findVerifier(credentialModal.value.verifier)}
            />
          )}
        </Modal>
        <h2 className="text-sm text-gray-600 font-bold mb-3">所有者情報</h2>
        <div className="jumpu-card p-4 mb-4">
          <HolderTable holder={holder} />
          {holder.description && (
            <Description description={holder.description} />
          )}
        </div>
        <h2 className="text-sm text-gray-600 font-bold mb-3">技術情報</h2>
        <div className="jumpu-card p-4">
          <TechTable
            className="p-4"
            profile={op}
            issuer={op.findCertifier(op.issuer)?.name}
          />
        </div>
      </div>
    </>
  );
}

export default Org;
