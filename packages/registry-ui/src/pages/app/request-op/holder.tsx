import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMount } from "react-use";
import AccountFormField from "../../../components/AccountFormField";
import FormRow from "../../../components/FormRow";
import PageFieldSet from "../../../components/PageFieldSet";
import {
  OpAccountWithCredentials,
  updateAccount,
  useAccount,
} from "../../../utils/account";
import {
  IFormInput,
  formValidationSchema,
  prefectures,
  stripEmpty,
} from "../../../utils/account-form";
import { useAccountDraft } from "../../../utils/draft";
import { useSession } from "../../../utils/session";

type HolderFormProps = {
  accountId: string;
  account: IFormInput;
  userId: string;
  mutateAccount: () => Promise<IFormInput | null>;
};

function HolderForm({
  accountId,
  account,
  userId,
  mutateAccount,
}: HolderFormProps) {
  const session = useSession();
  const [draft, setDraft, clearDraft] = useAccountDraft(userId);
  const hasDraft = !!draft;

  const methods = useForm<IFormInput>({
    mode: "onBlur",
    defaultValues: hasDraft ? draft : account,
    resolver: yupResolver(formValidationSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    reset,
    trigger,
  } = methods;

  // 前回訪問時の下書きがある場合は、その下書きのエラーを表示する。
  useMount(() => {
    if (hasDraft) {
      void trigger(Object.keys(draft) as Array<keyof IFormInput>);
    }
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    if (!account) {
      return;
    }

    const cleanData = stripEmpty(data);

    const token = await session.getAccessToken();
    const response = await updateAccount(
      cleanData as OpAccountWithCredentials,
      accountId,
      token,
    );
    if (!response.ok) {
      // TODO: エラーを表示して
      throw new Error();
    } else {
      // 成功の場合、SWR のキャッシュの revalidate を行う。
      await session.mutate();
      const data = await mutateAccount();
      reset(data ?? draft);
      clearDraft();
    }
  };

  const saveDraft = () => {
    setDraft(getValues());
  };

  // TODO: 審査コメントを各入力欄の下に表示して
  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-6 max-w-2xl"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-row md:items-center">
          <h2 className="text-3xl font-bold">組織情報</h2>
          <fieldset className="inline-flex gap-1 ml-auto">
            {/* Enter キーで下書き保存する。*/}
            <button
              type="button"
              className="hidden"
              onClick={(e) => {
                e.preventDefault();
                saveDraft();
              }}
            />
            <button
              type="button"
              className="jumpu-text-button text-danger"
              onClick={(e) => {
                e.preventDefault();
                clearDraft();
                reset(account);
              }}
              disabled={!hasDraft}
            >
              下書きをリセット
            </button>
            <button
              className="jumpu-outlined-button font-bold px-8"
              type="submit"
              disabled={!hasDraft || !isValid}
            >
              保存する
            </button>
          </fieldset>
        </div>
        <p className="text-sm">
          Originator Profile 情報を登録頂くフォームです。
          <br />
          サイト運営者・コンテンツ提供者などの組織情報を法人毎に登録してください。注:
          法人単位での登録です。
          <br />
          グループ会社一括やサイト・サービス単位ではありません。
        </p>
        <div className="flex flex-col gap-7">
          <AccountFormField
            name="domainName"
            label="組織代表ドメイン名"
            required
            placeHolder="media.example.com"
            onBlur={saveDraft}
          />
          <AccountFormField
            name="name"
            label="所有者 / 法人・組織名"
            required
            placeHolder="○△新聞社"
            onBlur={saveDraft}
          />
          <AccountFormField
            name="postalCode"
            label="郵便番号"
            inputClassName="w-40"
            required
            placeHolder="100-0001"
            onBlur={saveDraft}
          />

          <FormRow label="都道府県" required htmlFor="addressRegionSelect">
            <select
              id="addressRegionSelect"
              className={clsx("jumpu-select w-48 h-12", {
                "border-danger !border-2 !text-danger": errors.addressRegion,
              })}
              {...register("addressRegion", {
                onBlur: saveDraft,
              })}
            >
              <option disabled value="">
                未選択
              </option>
              {prefectures.map((prefecture) => (
                <option key={prefecture} value={prefecture}>
                  {prefecture}
                </option>
              ))}
            </select>
            <ErrorMessage
              errors={errors}
              name="addressRegion"
              render={({ message }) => (
                <p className="text-sm text-danger">{message}</p>
              )}
            />
          </FormRow>
          <AccountFormField
            name="addressLocality"
            label="市区町村"
            required
            placeHolder="千代田区"
            onBlur={saveDraft}
          />
          <AccountFormField
            name="streetAddress"
            label="町名・番地・ビル名・部屋番号など"
            required
            placeHolder="大手町3丁目1-1 ○△ビル 1F"
            onBlur={saveDraft}
          />

          <AccountFormField
            name="phoneNumber"
            inputClassName="w-48"
            label="電話番号"
            placeHolder="03-1111-1111"
            onBlur={saveDraft}
            inputProps={{ type: "tel" }}
          />

          <AccountFormField
            name="email"
            inputClassName="w-5/6"
            label="メールアドレス"
            placeHolder="contact@example.com"
            onBlur={saveDraft}
            inputProps={{ type: "email" }}
          />

          <AccountFormField
            name="corporateNumber"
            label="法人番号"
            placeHolder="1234567890123"
            onBlur={saveDraft}
            inputProps={{ type: "text", inputMode: "numeric" }}
          />

          <AccountFormField
            name="businessCategory"
            label="事業種目"
            placeHolder="新聞業"
            onBlur={saveDraft}
          />

          <AccountFormField
            name="url"
            label="WebサイトURL"
            placeHolder="https://www.example.com/"
            required
            onBlur={saveDraft}
            inputProps={{ type: "url" }}
          />
          <PageFieldSet
            name="contact"
            label="お問い合わせ情報"
            titleLabel="お問い合わせページの名称"
            urlLabel="リンク"
            titlePlaceholder="○△へのお問い合わせ"
            urlPlaceholder="https://www.example.com/contact/"
            onBlur={saveDraft}
          />
          <PageFieldSet
            name="publishingPrinciple"
            label="編集ガイドライン"
            titleLabel="ページの名称"
            urlLabel="リンク"
            titlePlaceholder="○△ガイドライン"
            urlPlaceholder="https://www.example.com/guidelines/"
            onBlur={saveDraft}
          />
          <PageFieldSet
            name="privacyPolicy"
            label="プライバシーボリシー"
            titleLabel="ページの名称"
            urlLabel="リンク"
            titlePlaceholder="○△プライバシーセンター"
            urlPlaceholder="https://www.example.com/privacy/"
            onBlur={saveDraft}
          />

          <AccountFormField
            name="description"
            label="説明"
            placeHolder="追加の説明情報（任意）"
            onBlur={saveDraft}
            textarea
          />
        </div>
      </form>
    </FormProvider>
  );
}

export default function Holder() {
  const session = useSession();
  const user = session.data?.user;
  const { data: account, mutate } = useAccount(user?.accountId ?? null);

  const convert = useCallback(
    (account: OpAccountWithCredentials): IFormInput => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, roleValue, credentials, businessCategory, ...rest } = account;
      return stripEmpty({
        ...rest,
        businessCategory: businessCategory?.[0],
      }) as IFormInput;
    },
    [],
  );

  const mutateAccount = useCallback(async () => {
    const data = await mutate<OpAccountWithCredentials>();
    return data ? convert(data) : null;
  }, [mutate, convert]);

  const accountData = useMemo(
    () => (account ? convert(account) : null),
    [account, convert],
  );

  if (!account || !accountData || !user) {
    return <p>Loading...</p>;
  }

  return (
    <HolderForm
      accountId={account.id}
      account={accountData}
      userId={user.id}
      mutateAccount={mutateAccount}
    />
  );
}
