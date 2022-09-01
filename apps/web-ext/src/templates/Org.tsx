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
import TableRow from "../components/TableRow";

type Props = {
  op: Op;
  holder: OpHolder;
  roles: Role[];
  profileEndpoint: string;
  paths: { back: string };
};

function Org({ op, holder, roles, paths, profileEndpoint }: Props) {
  const logo = holder.logos?.find(({ isMain }) => isMain);
  return (
    <>
      <BackHeader className="sticky top-0" to={paths.back}>
        <h1 className="text-sm">{holder.name}</h1>
      </BackHeader>
      <div className="bg-gray-50 p-4">
        <Image
          className="mb-2"
          src={logo?.url}
          placeholderSrc="/assets/placeholder-logo-main.png"
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
        <table className="w-full table-fixed mb-3">
          <tbody>
            <TableRow header="組織情報の発行日" data="2022年7月1日" />
          </tbody>
        </table>
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
        <ul className="mb-4">
          <li className="flex items-center gap-4">
            <Image
              src="/assets/logo-certifier.png"
              placeholderSrc="/assets/placeholder-logo-main.png"
              alt=""
              width={80}
              height={50}
            />
            <p className="text-sm font-bold text-gray-700">
              ブランドセーフティ認証 第三者検証
            </p>
          </li>
        </ul>
        <h2 className="text-sm text-gray-600 font-bold mb-3">所有者情報</h2>
        <div className="jumpu-card p-2 mb-4">
          <HolderTable holder={holder} />
          {holder.description && (
            <Description description={holder.description} />
          )}
        </div>
        <h2 className="text-sm text-gray-600 font-bold mb-3">認定内容</h2>
        <div className="jumpu-card p-2 mb-4">
          <Image
            src="/assets/logo-certifier.png"
            placeholderSrc="/assets/placeholder-logo-main.png"
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
        <div className="jumpu-card p-2 mb-4">
          <TechTable
            className="jumpu-card p-2"
            profile={op}
            profileEndpoint={profileEndpoint}
          />
        </div>
      </div>
    </>
  );
}

export default Org;
