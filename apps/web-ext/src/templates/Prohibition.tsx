import {
  _,
  ProjectTitle,
  ProjectSummary,
  useSanitizedHtml,
} from "@originator-profile/ui";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { buildPublUrl } from "../utils/routes";
import { stringifyWithError } from "@originator-profile/core";

function WarningDetails({ tabId }: { tabId: number }) {
  return (
    <div className="pt-3">
      <p className="whitespace-pre-line">{_("Prohibition_DetailStatement")}</p>
      <ol className="pt-3 px-0.5 list-decimal">
        <li>{_("Prohibition_DetailReason_1")}</li>
        <li>{_("Prohibition_DetailReason_2")}</li>
      </ol>
      <p className="whitespace-pre-line pt-3">
        {_("Prohibition_DetailAdditional")}
      </p>
      <Link
        className="block text-gray-500 pb-3 pt-3"
        to={buildPublUrl(tabId, undefined)}
      >
        {_("Prohibition_DetailProceed")}
      </Link>
    </div>
  );
}

type ProhibitionProps = {
  errors: Error[];
  tabId: number;
};

function Prohibition({ errors, tabId }: ProhibitionProps) {
  const prohibitionStatement =
    useSanitizedHtml(_("Prohibition_Statement_HTML")) ?? "";
  return (
    <main className="fixed top-0 left-0 z-10 bg-white w-screen h-screen overflow-y-auto px-4 py-12">
      <ProjectTitle className="mb-12" as="header" />
      <h1 className="flex items-center flex-col gap-4 mb-12">
        <span className="text-red-700 h-7 text-base font-normal tracking-normal text-center whitespace-nowrap inline-block align-middle">
          <Icon
            icon="clarity:exclamation-triangle-line"
            className="text-red-700 text-5xl font-normal tracking-normal leading-10 text-center w-11 h-11 inline-block vertical-align"
          />{" "}
          {_("Prohibition_Warning")}
        </span>
        <br />
        <span className="whitespace-pre-line text-red-700 text-xl font-bold tracking-normal text-center w-96 h-6 inline-block align-middle">
          {_("Prohibition_Site")}
        </span>
      </h1>
      <article className="mb-12 max-w-sm mx-auto">
        <p
          className="text-sm tracking-normal text-left font-normal"
          data-testid="p-elm-prohibition-message"
          dangerouslySetInnerHTML={{
            __html: prohibitionStatement,
          }}
        />
        <details className="text-gray-700 pt-3">
          <summary>{_("Prohibition_StatementDetail")}</summary>
          {errors.map((error, index) => {
            return (
              <pre className="overflow-auto" key={index}>
                {stringifyWithError(error, 2)}
              </pre>
            );
          })}
          <WarningDetails tabId={tabId} />
        </details>
        <div className="pt-3">
          <ProjectSummary as="footer" />
        </div>
      </article>
    </main>
  );
}

export default Prohibition;
