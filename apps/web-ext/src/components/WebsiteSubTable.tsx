import clsx from "clsx";
import { OgWebsite } from "@webdino/profile-model";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  website: OgWebsite;
};

function WebsiteSubTable({ className, website }: Props) {
  return (
    <table className={clsx("w-full table-fixed", className)}>
      <tbody>
        {"url" in website && (
          <TableRow
            header="URL"
            data={
              <a
                className="anchor-link"
                href={website.url}
                target="_blank"
                rel="nodpener noreferrer"
              >
                {website.url}
              </a>
            }
          />
        )}
        {"https://schema.org/category" in website && (
          <TableRow
            header="カテゴリー"
            data={website["https://schema.org/category"]}
          />
        )}
      </tbody>
    </table>
  );
}

export default WebsiteSubTable;
