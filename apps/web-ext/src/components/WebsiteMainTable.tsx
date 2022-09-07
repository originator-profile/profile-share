import { OgWebsite } from "@webdino/profile-model";
import Table from "./Table";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  website: OgWebsite;
};

function WebsiteMainTable({ className, website }: Props) {
  return (
    <Table className={className}>
        {"https://schema.org/author" in website && (
          <TableRow header="著者" data={website["https://schema.org/author"]} />
        )}
        {"https://schema.org/editor" in website && (
          <TableRow
            header="編集者"
            data={website["https://schema.org/editor"]}
          />
        )}
    </Table>
  );
}

export default WebsiteMainTable;
