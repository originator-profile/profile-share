type Props = {
  header: React.ReactNode;
  data: React.ReactNode;
};

function TableRow({ header, data }: Props) {
  return (
    <tr className="text-xs">
      <th className="w-2/6 text-left pr-1 py-1 text-gray-500 font-normal">
        {header}
      </th>
      <td className="py-1 break-words">{data}</td>
    </tr>
  );
}

export default TableRow;
