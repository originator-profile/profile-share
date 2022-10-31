import { Icon } from "@iconify/react";
import { OpHolder } from "@webdino/profile-model";
import { Op } from "../types/profile";
import { Role } from "../types/role";
import Image from "../components/Image";
import BackHeader from "../components/BackHeader";
import Roles from "../components/Roles";
import HolderTable from "../components/HolderTable";
import Description from "../components/Description";
import CertifierTable from "../components/CertifierTable";
import TechTable from "../components/TechTable";
import Table from "../components/Table";
import TableRow from "../components/TableRow";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";
import logoCertifierUrl from "../assets/logo-certifier.png";

type Props = {
  op: Op;
  holder: OpHolder;
  roles: Role[];
  profileEndpoint?: URL;
  paths: { back: string };
};

function Org({ op, holder, roles, paths, profileEndpoint }: Props) {
  const logo = holder.logos?.find(({ isMain }) => isMain);
  const handleClick = () => {
    const element = document.querySelector(
      "#" + CSS.escape("ブランドセーフティ認証 第三者検証")
    );
    element?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <BackHeader className="sticky top-0" to={paths.back}>
        <h1 className="text-sm">{holder.name}</h1>
      </BackHeader>
      <div className="bg-gray-50 p-4">
        <Image
          className="mb-2"
          src={logo?.url}
          placeholderSrc={placeholderLogoMainUrl}
          alt=""
          width={120}
          height={120}
          rounded
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
          <TableRow
            header="組織情報の発行日"
            data={new Date(op.issuedAt).toLocaleString(navigator.language)}
          />
        </Table>
        {roles.length > 0 && <Roles className="mb-3" roles={roles} />}
        <div className="inline-flex items-center gap-2 bg-blue-50 px-2 py-1 mb-3 rounded-sm">
          <Icon
            className="flex-shrink-0 text-blue-500 text-base"
            icon="akar-icons:circle-check-fill"
          />
          <p className="flex-1 text-blue-500 text-xs font-bold">
            この組織は認証を受けています
          </p>
        </div>
        <ul className="mb-4 -mx-2">
          <li className="mb-2" onClick={handleClick}>
            <button className="flex items-center gap-4 hover:bg-primary-50 p-2 w-full rounded-sm">
              <Image
                src={logoCertifierUrl}
                placeholderSrc={placeholderLogoMainUrl}
                alt=""
                width={80}
                height={50}
              />
              <p className="text-sm font-bold text-gray-700">
                ブランドセーフティ認証 第三者検証
              </p>
            </button>
          </li>
        </ul>
        <h2 className="text-sm text-gray-600 font-bold mb-3">所有者情報</h2>
        <div className="jumpu-card p-4 mb-4">
          <HolderTable holder={holder} />
          {holder.description && (
            <Description description={holder.description} />
          )}
        </div>
        <h2 className="text-sm text-gray-600 font-bold mb-3">認定内容</h2>
        <div
          id="ブランドセーフティ認証 第三者検証"
          className="jumpu-card p-4 mb-4"
        >
          <Image
            src={logoCertifierUrl}
            placeholderSrc={placeholderLogoMainUrl}
            alt=""
            width={160}
            height={99}
          />
          <div className="inline-flex items-center gap-2 bg-blue-50 px-2 py-1 mb-3 rounded-sm">
            <Icon
              className="flex-shrink-0 text-blue-500 text-base"
              icon="akar-icons:circle-check-fill"
            />
            <p className="flex-1 font-bold text-blue-500 text-xs">
              第三者検証による認定です
            </p>
          </div>
          <CertifierTable op={op} />
        </div>
        <h2 className="text-sm text-gray-600 font-bold mb-3">技術情報</h2>
        <div className="jumpu-card p-4">
          <TechTable
            className="p-4"
            profile={op}
            profileEndpoint={profileEndpoint}
          />
        </div>
      </div>
    </>
  );
}

export default Org;
