import { Link } from "react-router-dom";
import { ProjectTitle, ProjectSummary } from "@originator-profile/ui";
import useProfileSet from "../utils/use-profile-set";
import { routes } from "../utils/routes";
import { _ } from "@originator-profile/ui/src/utils";

type Props = {
  variant: "profile" | "op" | "dp" | "holder" | "website";
};

const label: { [key in Props["variant"]]: string } = {
  profile: _("NotFound_OrganizationOrPublication"),
  op: _("NotFound_Organization"),
  dp: _("NotFound_Publication"),
  holder: _("NotFound_Holder"),
  website: _("NotFound_Website"),
} as const;

function NotFound({ variant }: Props) {
  const { tabId } = useProfileSet();
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
      <ProjectSummary as="footer" />
    </div>
  );
}

export default NotFound;
