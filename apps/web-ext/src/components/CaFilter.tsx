import { Menu, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { _ } from "@originator-profile/ui";
import clsx from "clsx";
import { Fragment } from "react";
import { listCas } from "./credentials";

type Props = {
  caListType: Parameters<typeof listCas>[1];
  setCaListType: (contentType: Parameters<typeof listCas>[1]) => void;
};

type MenuItemProps = {
  caListType: Parameters<typeof listCas>[1];
  title: string;
  selected: boolean;
  setCaListType: (contentType: Parameters<typeof listCas>[1]) => void;
};

function MenuItem({
  caListType,
  title,
  selected,
  setCaListType,
}: MenuItemProps) {
  return (
    <Menu.Item
      as="button"
      className="h-8 w-full flex items-center text-xs"
      key={caListType}
      onClick={() => setCaListType(caListType)}
      disabled={selected}
    >
      {({ active }) => (
        <>
          {selected && (
            <Icon className="mx-2 absolute" icon="fa6-solid:check" />
          )}
          <p
            className={clsx("ml-8", {
              ["font-bold"]: active,
            })}
          >
            {title}
          </p>
        </>
      )}
    </Menu.Item>
  );
}

function CaFilter({ caListType, setCaListType }: Props) {
  return (
    <Menu>
      {({ open }) => (
        <div className="relative">
          <Menu.Button className="flex w-16 h-10 items-center justify-center text-2xl">
            <Icon icon="ion:filter" />
          </Menu.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="rounded-lg absolute ml-2 py-2 w-36 bg-white shadow-lg z-20"
            >
              <MenuItem
                caListType="All"
                title={_("CaFilter_All")}
                selected={caListType === "All"}
                setCaListType={setCaListType}
              />
              <MenuItem
                caListType="Main"
                title={_("CaFilter_MainContent")}
                selected={caListType === "Main"}
                setCaListType={setCaListType}
              />
              <MenuItem
                caListType="Other"
                title={_("CaFilter_Other")}
                selected={caListType === "Other"}
                setCaListType={setCaListType}
              />
              <MenuItem
                caListType="OnlineAd"
                title={_("CaFilter_Advertisements")}
                selected={caListType === "OnlineAd"}
                setCaListType={setCaListType}
              />
            </Menu.Items>
          </Transition>
        </div>
      )}
    </Menu>
  );
}
export default CaFilter;
