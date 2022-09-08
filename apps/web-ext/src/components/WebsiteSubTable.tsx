import { OgWebsite } from "@webdino/profile-model";
import Table from "./Table";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  website: OgWebsite;
};

function WebsiteSubTable({ className, website }: Props) {
  return (
    <Table className={className}>
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
    </Table>
  );
}

export default WebsiteSubTable;
