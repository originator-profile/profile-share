import { Link } from "react-router";
import { ProjectTitle, ProjectSummary } from "@originator-profile/ui";
import { routes } from "../utils/routes";
import { stringifyWithError } from "@originator-profile/core";
import { _ } from "@originator-profile/ui/src/utils";
import { useCredentials } from "./credentials";

type Props = {
  variant: "profile" | "op" | "dp" | "holder" | "websiteAndCas";
  errors?: Error[];
};

const label: { [key in Props["variant"]]: string } = {
  profile: _("NotFound_OrganizationOrPublication"),
  op: _("NotFound_Organization"),
  dp: _("NotFound_Publication"),
  holder: _("NotFound_Holder"),
  websiteAndCas: _("NotFound_WebsiteAndPublication"),
} as const;

function NotFound({ variant, errors }: Props) {
  const { tabId } = useCredentials();
  return (
    <div className="px-4 py-12">
      <ProjectTitle as="header" />
      <article className="text-center mb-10">
        <h1 className="whitespace-pre-line text-lg mb-2">
          {_("NotFound_InformationNotFound", label[variant])}
        </h1>
        <p
          className="whitespace-pre-line text-xs text-gray-700 mb-8"
          data-testid="p-elm-notfound-message"
        >
          {_("NotFound_PageMightBeMoved", label[variant])}
        </p>
        <p>
          <Link
            className="text-xs text-blue-600 hover:underline"
            to={routes.base.build({ tabId: String(tabId) })}
          >
            {_("NotFound_ViewOtherPublications")}
          </Link>
        </p>
      </article>
      {errors && (
        <details>
          {errors.map((error, index) => {
            return (
              <pre className="overflow-auto" key={index}>
                {stringifyWithError(error, 2)}
              </pre>
            );
          })}
        </details>
      )}
      <ProjectSummary as="footer" />
    </div>
  );
}

export default NotFound;
