import clsx from "clsx";
import { AlertDialog, PromptDialog, useDialog } from "./dialog";
import { Request, useLatestRequest } from "../utils/request";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

type HeadingProps = {
  className?: string;
  children: React.ReactNode;
};

type LatestRequestProps = {
  className?: string;
  request: Request;
};

type RequestRequiredProps = Partial<LatestRequestProps>;

type RequestStatusProps = RequestRequiredProps | LatestRequestProps;
function Card(props: CardProps) {
  return (
    <section className={clsx("jumpu-card px-6 py-5", props.className)}>
      {props.children}
    </section>
  );
}

function Heading(props: HeadingProps) {
  return (
    <h3 className={clsx("text-lg font-bold", props.className)}>
      {props.children}
    </h3>
  );
}

function Pending(props: LatestRequestProps) {
  const latestRequest = useLatestRequest();
  const dialog = useDialog();

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
          dateTime={props.request.updatedAt}
        >
          最終申請日 {new Date(props.request.updatedAt).toLocaleDateString()}
        </time>
      </p>

      <button
        type="button"
        className="jumpu-button font-bold bg-danger"
        onClick={() => dialog.open()}
      >
        OP発行申請を取り下げる
      </button>

      <AlertDialog
        dialogRef={dialog.ref}
        title="申請を取り下げます。よろしいですか？"
        description="申請を取り下げると審査は実施されません。あらためて申請する必要があります。"
        confirmationText="はい、申請を取り下げます"
        cancellationText="いいえ、申請をつづけます"
        onConfirm={() => latestRequest.cancel()}
      />
    </Card>
  );
}

function ResubmitButton() {
  const latestRequest = useLatestRequest();
  const dialog = useDialog();
  return (
    <>
      <button
        type="button"
        className="jumpu-button font-bold"
        onClick={() => dialog.open()}
      >
        再申請する
      </button>

      <PromptDialog
        dialogRef={dialog.ref}
        title="再申請をはじめます。よろしいですか？"
        description="事務局にて登録した内容で審査を行ないます。申請後の結果は登録したメールにご連絡を行いますので今しばらくお待ちください。"
        textareaProps={{
          placeholder: "メッセージ (任意)",
        }}
        confirmationText="再申請をはじめる"
        cancellationText="キャンセル"
        onConfirm={async (message: string) => {
          await latestRequest.create({
            requestSummary: message,
          });
        }}
      />
    </>
  );
}

function Approved(props: LatestRequestProps) {
  return (
    <Card className={clsx("bg-primary-50", props.className)}>
      <Heading className="text-success mb-2">OPが発行されました。</Heading>
      <p className="text-xs mb-3">
        ご登録ありがとうございます。ご登録いただいた内容でOPが発行済みです。OPを活用して担当者さまの組織の身元を検証可能な形式で表明することができます。
      </p>
      <ResubmitButton />
    </Card>
  );
}

function Rejected(props: LatestRequestProps) {
  return (
    <Card className={clsx("bg-yellow-50", props.className)}>
      <Heading className="text-yellow-700 mb-2">
        申請が承認されませんでした。
      </Heading>
      <p className="text-xs mb-3">
        審査の結果、修正が必要な箇所がありました。お知らせで修正事項を確認いただき、修正をお願いいたします。修正完了後、改めてOP発行申請をお願いします。
      </p>
      {/* TODO: https://github.com/originator-profile/profile/issues/805 */}
      <div className="flex flex-row gap-3">
        <button type="button" className="jumpu-button font-bold">
          お知らせを確認する
        </button>
        <ResubmitButton />
      </div>
    </Card>
  );
}

function RequestRequired(props: RequestRequiredProps) {
  const latestRequest = useLatestRequest();
  const dialog = useDialog();

  return (
    <Card className={clsx("bg-yellow-50", props.className)}>
      <Heading className="text-yellow-700 mb-2">
        未申請の変更があります。
      </Heading>
      <p className="text-xs">
        OPに含まれていない内容があります。OPに含めるにはOP発行申請が必要です。
        {props.request && (
          <time
            className="block mt-1 text-xs text-gray-500"
            dateTime={props.request.updatedAt}
          >
            最終申請日 {new Date(props.request.updatedAt).toLocaleDateString()}
          </time>
        )}
      </p>

      <button
        type="button"
        className="jumpu-button font-bold mt-3"
        onClick={() => dialog.open()}
      >
        OP発行申請する
      </button>

      <PromptDialog
        dialogRef={dialog.ref}
        title="申請をはじめます。よろしいですか？"
        description="事務局にて登録した内容で審査を行ないます。申請後の結果は登録したメールにご連絡を行いますので今しばらくお待ちください。"
        textareaProps={{
          placeholder: "メッセージ (任意)",
        }}
        confirmationText="申請をはじめる"
        cancellationText="キャンセル"
        onConfirm={async (message: string) => {
          await latestRequest.create({
            requestSummary: message,
          });
        }}
      />
    </Card>
  );
}

function RequestStatus(props: RequestStatusProps) {
  switch (props.request?.status) {
    case "pending":
      return <Pending {...props} request={props.request} />;
    case "approved":
      return <Approved {...props} request={props.request} />;
    case "rejected":
      return <Rejected {...props} request={props.request} />;
    case "cancelled":
    default:
      return <RequestRequired {...props} />;
  }
}

export default RequestStatus;
