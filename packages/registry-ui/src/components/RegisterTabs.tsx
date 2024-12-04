import clsx from "clsx";
import { Link } from "react-router";
import useTabs from "../utils/use-tabs";
import { useStatus } from "../utils/status";

function Status(props: { status?: "registered" | "hasDraft" | null }) {
  if (props.status === "registered") {
    return null;
  } else if (props.status === "hasDraft") {
    return (
      <span className="text-xs font-normal text-yellow-700 bg-yellow-100 rounded-full ml-1.5 px-2.5 py-0.5">
        下書きあり
      </span>
    );
  } else {
    return (
      <span className="text-xs font-normal text-danger bg-red-100 rounded-full ml-1.5 px-2.5 py-0.5">
        未登録
      </span>
    );
  }
}

function RegisterTabs() {
  const { registerTabs, registerTabsSelected, isTabSelected } = useTabs();
  const status = useStatus();

  if (!registerTabsSelected) return null;

  return (
    <div className="jumpu-boxed-tabs mb-6">
      <h1 className="text-3xl font-bold border-b min-w-[12rem] py-2">登録</h1>
      <nav role="tablist" className="!justify-end">
        {registerTabs.map((registerTab) => (
          <Link
            key={registerTab.route}
            role="tab"
            aria-selected={isTabSelected(registerTab.route)}
            className={clsx(
              "min-w-[10rem] text-sm",
              isTabSelected(registerTab.route) && "font-bold",
              "!flex !justify-between !rounded-t !mr-0 !ml-0.5 !p-4 !border-inherit !border-b-transparent",
            )}
            to={`./${registerTab.route}/`}
          >
            <span className="min-w-[3.5rem]">{registerTab.name}</span>
            <Status status={status[registerTab.route]} />
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default RegisterTabs;
