import { Fragment } from "react";
import { Icon } from "@iconify/react";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { _ } from "@originator-profile/ui/src/utils";

type ContentType = "all" | "main" | "other" | "advertisement";

type Props = {
  contentType: ContentType;
  setContentType: (contentType: ContentType) => void;
};

type MenuItemProps = {
  contentType: ContentType;
  title: string;
  selected: boolean;
  setContentType: (contentType: ContentType) => void;
};

function MenuItem({
  contentType,
  title,
  selected,
  setContentType,
}: MenuItemProps) {
  return (
    <Menu.Item
      as="button"
      className="h-8 w-full flex items-center text-xs"
      key={contentType}
      onClick={() => setContentType(contentType)}
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

function DpFilter({ contentType, setContentType }: Props) {
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
                contentType="all"
                title={_("DpFilter_All")}
                selected={contentType === "all"}
                setContentType={setContentType}
              />
              <MenuItem
                contentType="main"
                title={_("DpFilter_MainContent")}
                selected={contentType === "main"}
                setContentType={setContentType}
              />
              <MenuItem
                contentType="other"
                title={_("DpFilter_Other")}
                selected={contentType === "other"}
                setContentType={setContentType}
              />
              <MenuItem
                contentType="advertisement"
                title={_("DpFilter_Advertisements")}
                selected={contentType === "advertisement"}
                setContentType={setContentType}
              />
            </Menu.Items>
          </Transition>
        </div>
      )}
    </Menu>
  );
}
export default DpFilter;
