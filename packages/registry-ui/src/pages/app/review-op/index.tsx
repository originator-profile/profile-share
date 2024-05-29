import clsx from "clsx";
import { Spinner } from "@originator-profile/ui";
import RequestTable from "../../../components/RequestTable";
import { useLatestRequestList } from "../../../utils/request";
import { useState } from "react";

function SwitchPendingStatus({
  pending,
  onSwitch,
}: {
  pending: boolean;
  onSwitch: (arg0: boolean) => void;
}) {
  return (
    <div className="flex">
      <div className="jumpu-toggle-switch w-40 h-16">
        <label
          className={clsx(
            "!rounded-l-md !rounded-r-none border border-primary-700",
            pending && "checked",
          )}
          htmlFor="pending"
        >
          <span
            className={clsx(
              "w-full h-full !rounded-l-md !rounded-r-none px-2.5 py-5 text-center",
              pending
                ? "text-white !bg-primary-700"
                : "text-primary-700 bg-white",
            )}
          >
            審査待ち
          </span>
        </label>
        <input
          id="pending"
          type="radio"
          name="pending"
          value="true"
          onChange={() => {
            onSwitch(true);
          }}
        />
      </div>
      <div className="jumpu-toggle-switch w-40 h-16">
        <label
          className={clsx(
            "w-full h-full !rounded-l-none !rounded-r-md border border-primary-700",
            !pending && "checked",
          )}
          htmlFor="nonpending"
        >
          <span
            className={clsx(
              "w-full h-full !rounded-l-none !rounded-r-md px-2.5 py-5 text-center",
              !pending
                ? "text-white !bg-primary-700"
                : "text-primary-700 bg-white",
            )}
          >
            審査完了
          </span>
        </label>
        <input
          id="nonpending"
          type="radio"
          name="pending"
          value="false"
          onChange={() => {
            onSwitch(false);
          }}
        />
      </div>
    </div>
  );
}

function Index() {
  const [pending, setPending] = useState(true);
  const latestRequestList = useLatestRequestList(pending);

  if (latestRequestList.isLoading) return <Spinner />;
  return (
    <div className="flex flex-col gap-y-6">
      <SwitchPendingStatus pending={pending} onSwitch={setPending} />
      <RequestTable requests={latestRequestList.data} />
    </div>
  );
}

export default Index;
