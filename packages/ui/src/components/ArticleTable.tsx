import { formatDatetoYYYYmd } from "@originator-profile/core";
import { twMerge } from "tailwind-merge";
import { ArticleCA } from "@originator-profile/model";
import Table from "./Table";
import TableRow from "./TableRow";
import { _ } from "../utils";

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
          data={formatDatetoYYYYmd(
            new Date(article.credentialSubject.datePublished),
          )}
        />
      )}
      {article.credentialSubject.dateModified && (
        <TableRow
          header={_("ArticleTable_LastModified")}
          data={formatDatetoYYYYmd(
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
