import { twMerge } from "tailwind-merge";
import { OpCredential } from "@originator-profile/model";
import { Icon } from "@iconify/react";
import { expirationDateTimeLocaleFrom } from "@originator-profile/core";
import Image from "./Image";
import Table from "./Table";
import TableRow from "./TableRow";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";
import useCertificationSystem from "../utils/use-certification-system";
import range from "just-range";
import useSanitizedHtml from "../utils/use-sanitized-html";

type Props = {
  className?: string;
  credential: OpCredential;
};

function CredentialDetail({ className, credential }: Props) {
  const { data } = useCertificationSystem(credential.url);
  const name = data?.name;
  const description = useSanitizedHtml(data?.description);

  return (
    <div className={twMerge("jumpu-card p-5 rounded-2xl", className)}>
      <header className="flex items-center gap-4 mb-4">
        <Image
          src={credential.image}
          placeholderSrc={placeholderLogoMainUrl}
          alt=""
          width={60}
          height={40}
        />
        <div>
          <h2 className="text-xs font-bold mb-1.5">
            {name ?? credential.name}
          </h2>
          {data?.certifier && (
            <p className="text-xs text-gray-600">{data.certifier.name} 発行</p>
          )}
        </div>
      </header>
      {description ? (
        <div
          className="text-sm text-gray-600 mb-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : (
        <div className="animate-pulse flex flex-col gap-2 mb-2">
          {range(0, 5).map((i) => (
            <div
              key={i}
              className={twMerge(
                "bg-slate-200 rounded h-3",
                i === 4 && "w-4/5",
              )}
            />
          ))}
        </div>
      )}
      <Table className="mb-2">
        <TableRow header="資格名" data={credential.name} />
        {data?.certifier && (
          <TableRow header="認証機関" data={data.certifier.name} />
        )}
        {data?.verifier && (
          <TableRow header="検証機関" data={data.verifier.name} />
        )}
        <TableRow
          header="発行日"
          data={new Date(credential.issuedAt).toLocaleString()}
        />
        <TableRow
          header="有効期限"
          data={expirationDateTimeLocaleFrom(credential.expiredAt)}
        />
      </Table>
      {data ? (
        <a
          className="card border px-5 py-3 flex items-center justify-between gap-2.5 rounded-2xl"
          target="_blank"
          rel="noopener noreferrer"
          href={data.url}
        >
          <span className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">くわしくはこちら</span>
            <span className="text-sm">{data.urlTitle}</span>
          </span>
          <Icon
            className="text-sm text-gray-500"
            icon="fa6-solid:arrow-right"
          />
        </a>
      ) : (
        <div className="animate-pulse">
          <div className="bg-slate-200 rounded h-14 rounded-2xl" />
        </div>
      )}
    </div>
  );
}

export default CredentialDetail;
