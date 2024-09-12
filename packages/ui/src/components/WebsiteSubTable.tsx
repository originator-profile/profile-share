import { OgWebsite } from "@originator-profile/model";
import { ExternalLink } from "./link";
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
          data={<ExternalLink href={website.url}>{website.url}</ExternalLink>}
        />
      )}
      {(website.category?.length ?? 0) > 0 && (
        <TableRow
          header="カテゴリー"
          data={website.category?.map((e) => e.name).join(", ")}
        />
      )}
    </Table>
  );
}

export default WebsiteSubTable;
