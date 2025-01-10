import { AdvertisementCA, ArticleCA } from "@originator-profile/model";
import { Image } from "@originator-profile/ui";
import placeholderDpThumbnail from "@originator-profile/ui/src/assets/placeholder-dp-thumbnail.png";
import clsx from "clsx";
import { Link, useParams } from "react-router";
import { buildPublUrl } from "../utils/routes";

type Props = {
  filteredCas: (ArticleCA | AdvertisementCA)[];
  onClickCa?: (ca: ArticleCA | AdvertisementCA) => void;
};

function CaSelector({ filteredCas, onClickCa }: Props) {
  const { issuer, subject, ...params } = useParams<{
    issuer: string;
    subject: string;
    tabId: string;
  }>();
  const tabId = Number(params.tabId);

  return (
    <ul>
      {filteredCas.map((ca) => {
        const active =
          ca.issuer === issuer && ca.credentialSubject.id === subject;
        return (
          <li key={`${ca.issuer}${ca.credentialSubject.id}`}>
            <Link
              className="flex justify-center items-center h-16 relative"
              to={buildPublUrl(tabId, ca)}
              onClick={() => onClickCa?.(ca)}
            >
              <div className="inline-block">
                <Image
                  className={clsx(
                    "bg-gray-200 rounded-lg transition duration-300 ease-in-out hover:ring-2 hover:ring-gray-500 hover:ring-offset-2",
                    { ["ring-2 ring-gray-500 ring-offset-2"]: active },
                  )}
                  src={ca.credentialSubject.image?.id}
                  placeholderSrc={placeholderDpThumbnail}
                  alt={
                    ca.credentialSubject.type === "Article"
                      ? ca.credentialSubject.headline
                      : ca.credentialSubject.title
                  }
                  width={44}
                  height={44}
                  cover
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default CaSelector;
