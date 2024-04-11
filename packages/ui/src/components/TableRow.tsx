import { twMerge } from "tailwind-merge";

type Props = {
  header: React.ReactNode;
  data: React.ReactNode;
  border?: boolean;
};

function TableRow({ header, data, border = false }: Props) {
  return (
    <tr
      className={twMerge(
        "text-xs w-full",
        border ? "border-b last:border-0 h-7" : "h-6",
      )}
    >
      <th
        className={twMerge(
          "whitespace-nowrap text-left pr-5 py-1 text-gray-600 font-normal",
          border ? "w-20" : "w-24",
        )}
      >
        {header}
      </th>
      <td className="py-1 break-all">{data}</td>
    </tr>
  );
}

export default TableRow;
