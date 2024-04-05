type Props = {
  header: React.ReactNode;
  data: React.ReactNode;
  border?: boolean;
};

function TableRow({ header, data }: Props) {
  return (
    <tr className="text-xs w-full">
      <th className="whitespace-nowrap text-left pr-5 py-1 text-gray-600 font-normal">
        {header}
      </th>
      <td className="py-1 break-all">{data}</td>
    </tr>
  );
}

export default TableRow;
