import clsx from "clsx";
import isAfter from "date-fns/isAfter";
import { Link, LinkProps } from "react-router-dom";
import { Icon } from "@iconify/react";
import { OpHolder, OpCredential } from "@webdino/profile-model";
import Image from "../components/Image";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";
import logomarkUrl from "../assets/logomark.svg";
import { getVerificationType } from "../utils/credential";

function Credential({
  className,
  credentials,
  credential,
  holder,
}: {
  className?: string;
  credentials: OpCredential[];
  credential: OpCredential;
  holder: OpHolder;
}) {
  const isValid = isAfter(new Date(credential.expiredAt), new Date());
  return (
    <div className={clsx("flex gap-4", className)}>
      <Image
        className="flex-shrink-0"
        src={credential.image}
        placeholderSrc={placeholderLogoMainUrl}
        alt=""
        width={55}
        height={35}
      />
      <div>
        <p className="text-sm text-gray-500 mb-1">
          <span className="font-bold text-gray-700 mr-1">
            {credential.name} {getVerificationType(credential, holder)}
          </span>
          {credentials.length > 1 &&
            `その他${credentials.length - 1}件の認証情報`}
        </p>
        {isValid ? (
          <p className="text-xs">
            <Icon
              className="inline text-blue-600 mr-1"
              icon="akar-icons:check"
            />
            有効期限内
          </p>
        ) : (
          <p className="text-xs">
            <Icon
              className="inline text-red-600 mr-1"
              icon="akar-icons:cross"
            />
            有効期限切れ
          </p>
        )}
      </div>
    </div>
  );
}

type Props = {
  className?: string;
  to: LinkProps["to"];
  holder: OpHolder;
  credentials: OpCredential[];
};

function HolderSummary({ className, to, holder, credentials }: Props) {
  const logo = holder.logos?.find(({ isMain }) => isMain);
  const [credential] = credentials;
  return (
    <Link className={clsx("jumpu-card block", className)} to={to}>
      <div className="flex items-center gap-4 mx-4 my-3">
        <Image
          className="flex-shrink-0"
          src={logo?.url}
          placeholderSrc={placeholderLogoMainUrl}
          alt=""
          width={60}
          height={60}
          rounded
        />
        <div>
          <p className="text-gray-700 text-sm">この記事を発行した組織</p>
          <p className="text-lg">{holder.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-blue-50 p-2 mx-4 my-3 rounded-sm">
        <img src={logomarkUrl} alt="" width={24} height={21} />
        <p className="flex-1 text-blue-500 text-base font-bold">
          この組織は認証を受けています
        </p>
      </div>
      {credential && (
        <Credential
          className="mx-4 my-3"
          credentials={credentials}
          credential={credential}
          holder={holder}
        />
      )}
      {holder.publishingPrincipleUrl && (
        <a
          className="block bg-gray-50 rounded-lg px-4 py-2 mx-4 my-3"
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
      <div className="flex gap-2 justify-center items-center text-sm border-t boder-gray-100 px-4 py-3">
        <span className="text-sm font-bold">組織情報を見る</span>
        <Icon className="flex-shrink-0" icon="fa6-solid:chevron-right" />
      </div>
    </Link>
  );
}

export default HolderSummary;
