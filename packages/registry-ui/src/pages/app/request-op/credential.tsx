import { Table, TableRow } from "@originator-profile/ui";

export default function Credential() {
  const accountName = "TODO株式会社";

  return (
    <div>
      <div className="flex flex-col mb-8 md:flex-row gap-8 md:gap-4 md:items-center">
        <h2 className="text-3xl font-bold">資格情報</h2>
      </div>
      <div className="mb-8">
        <p>
          第三者認証機関の承認を得たら、このページより Originator Profile（OP）
          事務局にお知らせください。 OP 事務局で確認が取れましたら、
          <b>{accountName}様の認証情報が更新されます。</b>
        </p>
      </div>
      <div className="mb-2">
        <h3 className="text-2xl font-bold">登録済み</h3>
      </div>
      <div className="mb-2">
        <button className="jumpu-outlined-button border-dashed px-4 py-6 w-full leading-7">
          新しい資格情報を追加する
        </button>
      </div>
      <h3 className="text-2xl font-bold mb-2">失効</h3>
      <div className="px-4 py-6 bg-gray-50">
        <Table className="">
          <TableRow header="認定内容" data="aa" />
          <TableRow header="認証機関" data="aa" />
          <TableRow header="検証機関" data="aa" />
          <TableRow header="認定書発行日" data="aa" />
          <TableRow header="有効期限" data="aa" />
        </Table>
      </div>
    </div>
  );
}
