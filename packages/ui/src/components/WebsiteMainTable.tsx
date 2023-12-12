import { OgWebsite } from "@originator-profile/model";
import Table from "./Table";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  website: OgWebsite;
};

function WebsiteMainTable({ className, website }: Props) {
  const genreNames = website.category?.map((c) => c.name).join(", ");
  return (
    <Table className={className}>
      {typeof website["https://schema.org/datePublished"] === "string" && (
        <TableRow
          header="公開日"
          data={new Date(
            website["https://schema.org/datePublished"],
          ).toLocaleString()}
          border
        />
      )}
      {typeof website["https://schema.org/dateModified"] === "string" && (
        <TableRow
          header="最終更新日"
          data={new Date(
            website["https://schema.org/dateModified"],
          ).toLocaleString()}
          border
        />
      )}
      {"https://schema.org/editor" in website && (
        <TableRow
          header="編集責任者"
          data={website["https://schema.org/editor"]}
          border
        />
      )}
      {"https://schema.org/author" in website && (
        <TableRow
          header="記事執筆者"
          data={website["https://schema.org/author"]}
          border
        />
      )}
      {"category" in website && (
        <TableRow header="ジャンル" data={genreNames} border />
      )}
    </Table>
  );
}

export default WebsiteMainTable;
