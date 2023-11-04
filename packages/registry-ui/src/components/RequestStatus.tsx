import clsx from "clsx";
import { Request } from "@originator-profile/model";
import {
  useCreateRequestHandler,
  useDeleteRequestHandler,
} from "../utils/request";

type Props = {
  className?: string;
  request: Request;
};

function Card(props: { className?: string; children: React.ReactNode }) {
  return (
    <section className={clsx("jumpu-card px-6 py-5", props.className)}>
      {props.children}
    </section>
  );
}

function Heading(props: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={clsx("text-lg font-bold", props.className)}>
      {props.children}
    </h3>
  );
}

function Pending(props: Props) {
  const handleClick = useDeleteRequestHandler();
  return (
    <Card className={clsx("bg-yellow-50", props.className)}>
      <Heading className="text-yellow-700 mb-2">
        申請が開始されました。
        <br />
        事務局からの審査結果をお待ちください。
      </Heading>
      <p className="text-xs mb-3">
        ご登録いただいた内容で審査を行っています。メールにてご連絡を行いますので今しばらくお待ちください。
        <time
          className="block mt-1 text-xs text-gray-500"
          dateTime={props.request.createdAt}
        >
          最終申請日 {new Date(props.request.createdAt).toLocaleDateString()}
        </time>
      </p>
      <button
        className="jumpu-button font-bold bg-danger"
        onClick={handleClick}
      >
        OP発行申請を取り消す
      </button>
    </Card>
  );
}

function Approved(props: Props) {
  return (
    <Card className={clsx("bg-primary-50", props.className)}>
      <Heading className="text-success mb-2">OPが発行されました。</Heading>
      <p className="text-xs">
        おめでとうございます。ご登録いただいた内容でOPが発行済みです。OPを活用して担当者さまの組織の身元を検証可能な形式で表明することができます。
      </p>
    </Card>
  );
}

function Rejected(props: Props) {
  return (
    <Card className={clsx("bg-yellow-50", props.className)}>
      <Heading className="text-yellow-700 mb-2">
        申請が承認されませんでした。
      </Heading>
      <p className="text-xs mb-3">
        審査の結果、修正が必要な箇所がありました。お知らせで修正事項を確認いただき、修正をお願いいたします。修正完了後、改めてOP発行申請をお願いします。
      </p>
      {/* TODO: お知らせ画面を実装して */}
      <button className="jumpu-button font-bold">お知らせを確認する</button>
    </Card>
  );
}

function RequestReady(props: Props) {
  const handleClick = useCreateRequestHandler();
  return (
    <Card className={clsx("bg-yellow-50", props.className)}>
      <Heading className="text-yellow-700 mb-2">
        未申請の変更があります。
      </Heading>
      <p className="text-xs mb-3">
        OPに含まれていない内容があります。OPに含めるにはOP発行申請が必要です。
        <time
          className="block mt-1 text-xs text-gray-500"
          dateTime={props.request.createdAt}
        >
          最終申請日 {new Date(props.request.createdAt).toLocaleDateString()}
        </time>
      </p>
      <button className="jumpu-button font-bold" onClick={handleClick}>
        OP発行申請する
      </button>
    </Card>
  );
}

function RequestStatus(props: Props) {
  if (props.request.status === "pending") return <Pending {...props} />;
  if (props.request.status === "rejected") return <Rejected {...props} />;
  if (props.request.status === "cancelled") return <RequestReady {...props} />;
  // TODO: OPの発行日時より後に登録内容を更新したらRequestReadyを表示して
  return <Approved {...props} />;
}

export default RequestStatus;
