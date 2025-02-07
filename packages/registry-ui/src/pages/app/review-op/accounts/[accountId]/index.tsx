import { Icon } from "@iconify/react";
import { formatLocaleDate } from "@originator-profile/core";
import { CredentialTable, Spinner } from "@originator-profile/ui";
import { Link } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
import { useParams } from "../../../../../router";
import { useAccountLogo } from "../../../../../utils/account";
import { NAMES } from "../../../../../utils/account-form";
import { useCredentials } from "../../../../../utils/credential";
import { Account, useLatestRequest } from "../../../../../utils/request";
import { useUserAccount } from "../../../../../utils/user-account";

interface BreadCrumbProps {
  accountName: string;
}

function BreadCrumb(props: BreadCrumbProps) {
  return (
    <div className={"flex flex-row gap-2"}>
      <span className={"text-xs font-bold"}>
        <Link to={"/app/review-op/"}>ホーム</Link>
      </span>
      <span className={"text-xs"}>&gt;</span>
      <span className={"text-xs"}>{props.accountName}</span>
    </div>
  );
}

function Status({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return (
        <span className="jumpu-badge text-xs font-normal bg-gray-100">
          審査中
        </span>
      );
    case "approved":
      return (
        <span className="jumpu-badge text-xs font-normal bg-primary-100 text-primary-600">
          承認済み
        </span>
      );
    case "rejected":
      return (
        <span className="jumpu-badge text-xs font-normal bg-danger-extralight text-danger">
          未承認
        </span>
      );
    case "cancelled":
      return (
        <span className="jumpu-badge text-xs font-normal bg-gray-100">
          取り下げ済み
        </span>
      );
    default:
      return null;
  }
}

function GroupHeader(props: { accountName: string; createdAt: string }) {
  return (
    <section>
      <h1 className={"text-lg font-bold leading-7"}>{props.accountName}</h1>
      <p className={"text-xs font-normal text-gray-500"}>
        申請提出日 {formatLocaleDate(new Date(props.createdAt))}
      </p>
    </section>
  );
}

function Author(props: { name: string; logoUrl: string; email: string }) {
  return (
    <section className={"flex flex-row gap-3"}>
      <div className={"jumpu-avatar w-10 h-10"}>
        <img src={props.logoUrl} alt={props.name} />
      </div>
      <div className={"flex flex-col"}>
        <span className={"text-lg"}>{props.name}</span>
        <span className={"text-xs text-gray-600"}>{props.email}</span>
      </div>
    </section>
  );
}

function ReviewIcon(props: { className?: string; hasReview: boolean }) {
  return (
    <Icon
      className={twMerge(
        /* TODO: gh-942 */ "hidden w-6 h-6 text-xl",
        props.hasReview ? "text-primary" : "text-gray-100",
        props.className,
      )}
      icon={props.hasReview ? "f7:text-bubble-fill" : "f7:bubble-left-fill"}
    />
  );
}

function ExpandCommentButton(props: { className?: string }) {
  return (
    <Icon
      className={twMerge(
        /* TODO: gh-942 */ "hidden text-xl text-gray-400 w-8",
        props.className,
      )}
      icon={"mdi:keyboard-arrow-right"}
    />
  );
}

interface GroupItem {
  name: keyof typeof NAMES;
  value: string | undefined | null;
}

function GroupItem({ name, value }: GroupItem) {
  const hasReview = false;
  return (
    <div className={"flex flex-row gap-4 items-center"}>
      <ReviewIcon hasReview={hasReview} />
      <span className={"text-xs text-gray-500 w-[172px]"}>{NAMES[name]}</span>
      <span className={"text-sm"}>{value && value}</span>
      <ExpandCommentButton className="ml-auto" />
    </div>
  );
}

interface GroupInformationProps {
  data: Account;
}

function GroupInformation({ data }: GroupInformationProps) {
  const keys = [
    "domainName",
    "name",
    "postalCode",
    "addressRegion",
    "addressLocality",
    "streetAddress",
    "phoneNumber",
    "email",
    "corporateNumber",
    "businessCategory",
    "url",
    "contactTitle",
    "contactUrl",
    "publishingPrincipleTitle",
    "publishingPrincipleUrl",
    "privacyPolicyTitle",
    "privacyPolicyUrl",
    "description",
  ] as (keyof typeof NAMES)[];
  return (
    <section className={"flex flex-col gap-4"}>
      <h2 className={"text-base font-bold leading-6 text-gray-800"}>
        基本情報
      </h2>
      <div className={"flex flex-col gap-4"}>
        {keys.map((key) => (
          <GroupItem key={key} name={key} value={data[key]} />
        ))}
      </div>
    </section>
  );
}

function Logo() {
  const { accountId } = useParams("/app/review-op/accounts/:accountId");
  const { data: logo } = useAccountLogo(accountId);

  return (
    <section className="flex flex-col gap-4">
      <h2 className={"text-base font-bold leading-6 text-gray-800"}>
        ロゴマーク
      </h2>
      {logo ? (
        <div className="flex flex-row gap-4">
          <ReviewIcon hasReview={false} />

          <div
            className={
              "grid place-items-center box-content w-[198px] h-[198px] border border-gray-100 rounded-2xl overflow-hidden"
            }
          >
            <img
              src={logo?.url}
              className="w-[198px] h-[198px] no-border object-scale-down"
              alt="ロゴ画像プレビュー"
            />
          </div>

          <ExpandCommentButton className="ml-auto" />
        </div>
      ) : (
        <p className="text-sm">ロゴが登録されていません。</p>
      )}
    </section>
  );
}

function Credentials() {
  const { accountId } = useParams("/app/review-op/accounts/:accountId");
  const { data } = useCredentials(accountId);

  if (!data) {
    return <Spinner />;
  }

  return (
    <section>
      <h2 className={"text-base font-bold leading-6 text-gray-800"}>
        認定情報
      </h2>
      {data?.map((credential, index, array) => (
        <Fragment key={credential.id}>
          <div className={"flex flex-row py-4 gap-4"}>
            <ReviewIcon className="mt-1" hasReview={false} />
            <CredentialTable
              className="[&_th]:w-[188px] [&_th]:text-xs [&_th]:text-gray-500 [&_td]:text-sm"
              data={credential}
            />
            <ExpandCommentButton className={"mt-1 ml-auto"} />
          </div>
          {index < array.length - 1 && <hr />}
        </Fragment>
      ))}
    </section>
  );
}

function Index() {
  const { accountId } = useParams("/app/review-op/accounts/:accountId");
  const { data: latestRequest, isLoading } = useLatestRequest(accountId);
  const { data: userAccount } = useUserAccount(latestRequest?.authorId);

  if (isLoading) {
    return <Spinner />;
  }
  if (!latestRequest) {
    return <p>申請が見つかりませんでした。</p>;
  }

  if (!userAccount) {
    return <p>ユーザーが見つかりませんでした。</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <BreadCrumb accountName={latestRequest?.request.group.name} />
      <div className={"flex flex-col gap-4"}>
        <div>
          <Status status={latestRequest.status} />
        </div>
        <GroupHeader
          accountName={latestRequest.request.group.name}
          createdAt={latestRequest.createdAt}
        />
        <Author
          name={userAccount.name}
          email={userAccount.email}
          logoUrl={userAccount.picture}
        />
      </div>

      <div className={"flex flex-col gap-8"}>
        <GroupInformation data={latestRequest.request.group} />
        <Logo />
        <Credentials />
      </div>
    </div>
  );
}

export default Index;
