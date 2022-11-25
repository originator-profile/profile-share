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
      {typeof website["https://schema.org/datePublished"] === "string" && (
        <TableRow
          header="初回公開日"
          data={new Date(
            website["https://schema.org/datePublished"]
          ).toLocaleString(navigator.language)}
        />
      )}
      {typeof website["https://schema.org/dateModified"] === "string" && (
        <TableRow
          header="最終更新日"
          data={new Date(
            website["https://schema.org/dateModified"]
          ).toLocaleString(navigator.language)}
        />
      )}
      {"https://schema.org/author" in website && (
        <TableRow header="著者" data={website["https://schema.org/author"]} />
      )}
      {"https://schema.org/editor" in website && (
        <TableRow header="編集者" data={website["https://schema.org/editor"]} />
      )}
    </Table>
  );
}

export default WebsiteMainTable;
