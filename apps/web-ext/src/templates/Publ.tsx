import { Icon } from "@iconify/react";
import { Disclosure, Transition } from "@headlessui/react";
import { Dp, DpWebsite } from "../types/dp";
import Image from "../components/Image";
import VerifySuccessBadge from "../components/VerifySuccessBadge";
import VerifyFailureBadge from "../components/VerifyFailureBadge";
import WebsiteMainTable from "../components/WebsiteMainTable";
import WebsiteSubTable from "../components/WebsiteSubTable";
import TechTable from "../components/TechTable";
import Description from "../components/Description";
import NavLink from "../components/NavLink";

type Props = {
  dp: Dp;
  website: DpWebsite;
  paths: { org: string };
  profileEndpoint: string;
};

function Publ({ dp, website, paths, profileEndpoint }: Props) {
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="flex gap-4">
        <Image
          className="flex-shrink-0"
          src={website.image}
          placeholderSrc="/assets/placeholder-logo-main.png"
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
                  <span className="text-black font-bold">
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
                    <TechTable profileEndpoint={profileEndpoint} profile={dp} />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </div>
      </div>
      <div className="px-3 py-3 bg-white">
        {dp.error instanceof Error ? (
          <VerifyFailureBadge />
        ) : (
          <VerifySuccessBadge />
        )}
      </div>
      <hr className="border-gray-50 border-4" />
      <div className="px-3 pt-2">
        {paths.org && (
          <NavLink className="mb-2" to={paths.org}>
            所有者情報
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default Publ;
