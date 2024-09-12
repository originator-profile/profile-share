import { OgWebsite } from "@originator-profile/model";
import { ExternalLink } from "./link";
import Table from "./Table";
import TableRow from "./TableRow";
import { _ } from "../utils";

type Props = {
  className?: string;
  website: OgWebsite;
};

function WebsiteSubTable({ className, website }: Props) {
  return (
    <Table className={className}>
      {"url" in website && (
        <TableRow
          header={_("WebsiteSubTable_URL")}
          data={<ExternalLink href={website.url}>{website.url}</ExternalLink>}
        />
      )}
      {(website.category?.length ?? 0) > 0 && (
        <TableRow
          header={_("WebsiteSubTable_Category")}
          data={website.category?.map((e) => e.name).join(", ")}
        />
      )}
    </Table>
  );
}

export default WebsiteSubTable;
