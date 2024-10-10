import { twMerge } from "tailwind-merge";
import { OgWebsite } from "@originator-profile/model";
import Table from "./Table";
import TableRow from "./TableRow";
import { _ } from "../utils";

type Props = {
  className?: string;
  website: OgWebsite;
};

function WebsiteMainTable({ className, website }: Props) {
  const genreNames = website.category?.map((c) => c.name).join(", ");
  return (
    <Table
      className={twMerge(
        "[&_tbody]:divide-y [&_tr]:h-7 [&_th]:w-20",
        className,
      )}
    >
      {typeof website["https://schema.org/datePublished"] === "string" && (
        <TableRow
          header={_("WebsiteMainTable_PublishDate")}
          data={new Date(
            website["https://schema.org/datePublished"],
          ).toLocaleString()}
        />
      )}
      {typeof website["https://schema.org/dateModified"] === "string" && (
        <TableRow
          header={_("WebsiteMainTable_LastModified")}
          data={new Date(
            website["https://schema.org/dateModified"],
          ).toLocaleString()}
        />
      )}
      {"https://schema.org/editor" in website && (
        <TableRow
          header={_("WebsiteMainTable_EditorInChief")}
          data={website["https://schema.org/editor"]}
        />
      )}
      {"https://schema.org/author" in website && (
        <TableRow
          header={_("WebsiteMainTable_Author")}
          data={website["https://schema.org/author"]}
        />
      )}
      {"category" in website && (
        <TableRow header={_("WebsiteMainTable_Category")} data={genreNames} />
      )}
    </Table>
  );
}

export default WebsiteMainTable;
