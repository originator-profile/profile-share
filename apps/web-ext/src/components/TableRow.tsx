type Props = {
  header: React.ReactNode;
  data: React.ReactNode;
};

function TableRow({ header, data }: Props) {
  return (
    <tr className="text-xs">
      <th className="w-0 whitespace-nowrap text-left pr-4 py-1 text-gray-600 font-normal">
        {header}
      </th>
      <td className="py-1 break-all">{data}</td>
    </tr>
  );
}

export default TableRow;
