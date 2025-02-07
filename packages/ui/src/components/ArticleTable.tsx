import { formatLocaleDate } from "@originator-profile/core";
import { ArticleCA } from "@originator-profile/model";
import { twMerge } from "tailwind-merge";
import { _ } from "../utils";
import Table from "./Table";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  article: ArticleCA;
};

function ArticleTable({ className, article }: Props) {
  return (
    <Table
      className={twMerge(
        "[&_tbody]:divide-y [&_tr]:h-7 [&_th]:w-20",
        className,
      )}
    >
      {article.credentialSubject.datePublished && (
        <TableRow
          header={_("ArticleTable_PublishDate")}
          data={formatLocaleDate(
            new Date(article.credentialSubject.datePublished),
          )}
        />
      )}
      {article.credentialSubject.dateModified && (
        <TableRow
          header={_("ArticleTable_LastModified")}
          data={formatLocaleDate(
            new Date(article.credentialSubject.dateModified),
          )}
        />
      )}
      {"editor" in article.credentialSubject && (
        <TableRow
          header={_("ArticleTable_EditorInChief")}
          data={article.credentialSubject.editor?.join(", ")}
        />
      )}
      {"aurhor" in article.credentialSubject && (
        <TableRow
          header={_("ArticleTable_Author")}
          data={article.credentialSubject.author?.join(", ")}
        />
      )}
      {"genre" in article.credentialSubject && (
        <TableRow
          header={_("ArticleTable_Category")}
          data={article.credentialSubject.genre}
        />
      )}
    </Table>
  );
}

export default ArticleTable;
