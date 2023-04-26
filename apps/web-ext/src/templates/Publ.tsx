import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Disclosure, Transition } from "@headlessui/react";
import { OgWebsite, OpHolder } from "@webdino/profile-model";
import { Dp } from "../types/profile";
import Image from "../components/Image";
import WebsiteMainTable from "../components/WebsiteMainTable";
import WebsiteSubTable from "../components/WebsiteSubTable";
import TechTable from "../components/TechTable";
import Description from "../components/Description";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";
import logoCertifierUrl from "../assets/logo-certifier.png";
import logomarkUrl from "../assets/logomark.svg";

type Props = {
  dp: Dp;
  website: OgWebsite;
  holder: OpHolder;
  paths: { org: string };
};

function Publ({ dp, website, holder, paths }: Props) {
  const logo = holder.logos?.find(({ isMain }) => isMain);
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="flex gap-4">
        <Image
          className="flex-shrink-0 mt-8"
          src={website.image}
          placeholderSrc={placeholderLogoMainUrl}
          alt=""
          width={80}
          height={45}
        />
        <div className="mb-4">
          <p className="jumpu-badge bg-white text-xs border border-gray-300">
            記事
          </p>
          <h1 className="text-base text-gray-700 mb-2">{website.title}</h1>
          <WebsiteMainTable className="mb-1" website={website} />
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button>
                  <Icon
                    className="inline mr-1"
                    icon={
                      open
                        ? "ant-design:minus-square-outlined"
                        : "ant-design:plus-square-outlined"
                    }
                  />
                  <span className="text-xs font-bold">
                    この記事についてさらに詳しく...
                  </span>
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transition scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel>
                    <WebsiteSubTable website={website} />
                    {website.description && (
                      <Description description={website.description} />
                    )}
                    <TechTable profile={dp} />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </div>
      </div>
      <Link className="jumpu-card block" to={paths.org}>
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
        <div className="flex mx-4 my-3 gap-4">
          <Image
            className="flex-shrink-0"
            src={logoCertifierUrl}
            placeholderSrc={placeholderLogoMainUrl}
            alt=""
            width={80}
            height={50}
          />
          <div>
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-bold text-gray-700 mr-1">
                無効トラフィック対策認証 第三者検証
              </span>
              その他2件の認証情報
            </p>
            <p className="text-xs">
              <Icon
                className="inline text-blue-600 mr-1"
                icon="akar-icons:check"
              />
              有効期限内
            </p>
          </div>
        </div>
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
    </div>
  );
}

export default Publ;
