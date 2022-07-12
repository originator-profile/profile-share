type Props = {
  header: React.ReactNode;
  data: React.ReactNode;
};

function TableRow({ header, data }: Props) {
  return (
    <tr className="text-xs">
      <th className="w-2/6 text-left pl-3 pr-1 py-2 text-gray-500 font-normal border-gray-200 border-b">
        {header}
      </th>
      <td className="pr-3 py-2 border-gray-200 border-b break-words">{data}</td>
    </tr>
  );
}

export default TableRow;
