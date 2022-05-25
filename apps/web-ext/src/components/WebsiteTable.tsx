import { DpWebsite } from "../types/dp";
import TableRow from "./TableRow";

type Props = {
  className?: string;
  website: DpWebsite;
};

function WebsiteTable({ className, website }: Props) {
  return (
    <table className={className}>
      <tbody>
        {"title" in website && (
          <TableRow header="タイトル" data={website.title} />
        )}
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
        {"https://schema.org/author" in website && (
          <TableRow header="著者" data={website["https://schema.org/author"]} />
        )}
        {"https://schema.org/category" in website && (
          <TableRow
            header="カテゴリー"
            data={website["https://schema.org/category"]}
          />
        )}
        {"https://schema.org/editor" in website && (
          <TableRow
            header="編集者"
            data={website["https://schema.org/editor"]}
          />
        )}
      </tbody>
    </table>
  );
}

export default WebsiteTable;
