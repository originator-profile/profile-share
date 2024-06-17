import { Request } from "@originator-profile/model";

type LatestRequestListProps = {
  className?: string;
  requests: Request[];
};

type RequestRequiredProps = Partial<LatestRequestListProps>;

type RequestTableProps = RequestRequiredProps | LatestRequestListProps;

type RequestTableRowProps = {
  org: string;
  comment: string;
  date: Date;
};

function RequestTableRow({ org, comment, date }: RequestTableRowProps) {
  return (
    <tr className="border border-collapse border-gray-200 text-black">
      <td className="text-start px-4 py-2 truncate text-base">{org}</td>
      <td className="text-start py-2 truncate text-sm">{comment}</td>
      <td className="text-start px-4 py-2 text-xs">
        {date.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>
    </tr>
  );
}
function RequestTable(props: RequestTableProps) {
  return (
    <div className="w-[794px]">
      <table className="table-fixed w-full gap-y-1.5">
        <thead className="h-5">
          <tr>
            <th className="w-[16rem] text-xs text-gray-400 text-start px-4 py-1">
              組織名
            </th>
            <th className="w-[26rem] text-xs text-gray-400 text-start py-1">
              コメント
            </th>
            <th className="text-xs text-gray-400 text-start px-4 py-1">
              申請提出日
            </th>
          </tr>
        </thead>
        <tbody>
          {props.requests
            ?.toSorted((v1, v2) =>
              new Date(v1.updatedAt) < new Date(v2.updatedAt) ? 1 : -1,
            )
            .map((item, index) => {
              return (
                <RequestTableRow
                  key={index}
                  org={item.group}
                  comment={item.reviewSummary ?? item.requestSummary ?? ""}
                  date={new Date(item.createdAt)}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default RequestTable;
