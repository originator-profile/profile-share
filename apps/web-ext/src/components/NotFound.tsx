import { Link } from "react-router-dom";
import { ProjectTitle, ProjectSummary } from "@originator-profile/ui";
import useProfiles from "../utils/use-profiles";
import { routes } from "../utils/routes";

type Props = {
  variant: "profile" | "op" | "dp" | "holder" | "website";
};

const label: { [key in Props["variant"]]: string } = {
  profile: "組織あるいは出版物",
  op: "組織",
  dp: "出版物",
  holder: "所有者",
  website: "ウェブサイト",
} as const;

function NotFound({ variant }: Props) {
  const { tabId } = useProfiles();
  return (
    <div className="px-4 py-12">
      <ProjectTitle as="header" />
      <article className="text-center mb-10">
        <h1 className="text-lg mb-2">
          {label[variant]}の情報が
          <br />
          見つかりませんでした
        </h1>
        <p
          className="text-xs text-gray-700 mb-8"
          data-testid="p-elm-notfound-message"
        >
          ページの移動によって{label[variant]}の情報が
          <br />
          失われた可能性があります
        </p>
        <p>
          <Link
            className="text-xs text-blue-600 hover:underline"
            to={routes.base.build({ tabId: String(tabId) })}
          >
            他の出版物をみる
          </Link>
        </p>
      </article>
      <ProjectSummary as="footer" />
    </div>
  );
}

export default NotFound;
