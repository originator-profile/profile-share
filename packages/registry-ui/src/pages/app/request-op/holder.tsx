import { ComponentProps, SyntheticEvent, useEffect, useMemo } from "react";
import clsx from "clsx";
import {
  useForm,
  SubmitHandler,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRow from "../../../components/FormRow";
import { useSession } from "../../../utils/session";
import {
  OpAccountWithCredentials,
  updateAccount,
  useAccount,
} from "../../../utils/account";
import { useAccountDraft } from "../../../utils/draft";
import {
  prefectures,
  normalizeJapanPostalCode,
  convertToHalfWidth,
} from "../../../utils/account-form";

// API から得られるデータでは任意の項目は null を取りうるため、
// フォームのデフォルト値も null を許容する。
// これに合わせて Yup のスキーマ定義でも任意の項目に nullable() を適用する必要がある。
export interface IFormInput {
  domainName: string;
  name: string;
  postalCode: string;
  addressRegion: string;
  addressLocality: string;
  streetAddress: string;
  phoneNumber?: string | null;
  email?: string | null;
  corporateNumber?: string | null;
  businessCategory?: string | null;
  url: string;
  contactTitle?: string | null;
  contactUrl?: string | null;
  publishingPrincipleTitle?: string | null;
  publishingPrincipleUrl?: string | null;
  privacyPolicyTitle?: string | null;
  privacyPolicyUrl?: string | null;
  description?: string | null;
}

type FormFieldProps = {
  name: keyof IFormInput;
  label: string;
  inputClassName?: string;
  required?: boolean;
  helpText?: string;
  placeHolder?: string;
  onBlur: (e: SyntheticEvent) => void;
  inputProps?: ComponentProps<"input">;
};

function FormField({
  name,
  inputClassName,
  label,
  required,
  helpText,
  placeHolder,
  onBlur,
  inputProps,
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <FormRow
      label={label}
      required={required}
      htmlFor={`${name}Input`}
      helpText={helpText}
    >
      <input
        id={`${name}Input`}
        className={clsx("jumpu-input h-12", inputClassName, {
          "border-orange-700 !border-2 !text-orange-700": errors[name],
        })}
        placeholder={placeHolder}
        {...register(name, {
          onBlur: onBlur,
        })}
        {...inputProps}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className="text-sm text-orange-700">{message}</p>
        )}
      />
    </FormRow>
  );
}

type PageFieldSetProps = {
  name: string;
  label: string;
  titleLabel: string;
  urlLabel: string;
  titlePlaceholder: string;
  urlPlaceholder: string;
  onBlur: (e: SyntheticEvent) => void;
};

function PageFieldSet({
  name,
  label,
  titleLabel,
  urlLabel,
  titlePlaceholder,
  urlPlaceholder,
  onBlur,
}: PageFieldSetProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const urlName = `${name}Url`;
  const titleName = `${name}Title`;
  const urlInputId = `${name}UrlInput`;
  const titleInputId = `${name}TitleInput`;

  return (
    <fieldset className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
      <div className="text-sm leading-normal flex-shrink-0 w-40 self-start">
        {label}
      </div>
      <div className="bg-gray-100 p-4 flex flex-col w-full rounded-lg gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={titleInputId}>
            <span className="text-sm leading-normal">{titleLabel}</span>
          </label>
          <input
            id={titleInputId}
            className={clsx("jumpu-input h-12 w-full", {
              "border-orange-700 !border-2 !text-orange-700": errors[titleName],
            })}
            {...register(titleName, { onBlur: onBlur })}
            placeholder={titlePlaceholder}
          />
          <ErrorMessage
            errors={errors}
            name={titleName}
            render={({ message }) => (
              <p className="text-sm text-orange-700">{message}</p>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={urlInputId}>
            <span className="text-sm leading-normal">{urlLabel}</span>
          </label>
          <input
            id={urlInputId}
            type="url"
            className={clsx("jumpu-input h-12 w-full", {
              "border-orange-700 !border-2 !text-orange-700": errors[urlName],
            })}
            {...register(urlName, {
              onBlur: onBlur,
            })}
            placeholder={urlPlaceholder}
          />
          <ErrorMessage
            errors={errors}
            name={urlName}
            render={({ message }) => (
              <p className="text-sm text-orange-700">{message}</p>
            )}
          />
        </div>
      </div>
    </fieldset>
  );
}

const formValidationSchema: Yup.ObjectSchema<IFormInput> = Yup.object({
  domainName: Yup.string().required("このフィールドを入力してください。"),
  name: Yup.string().required("このフィールドを入力してください。"),
  postalCode: Yup.string()
    .transform(convertToHalfWidth)
    .transform(normalizeJapanPostalCode)
    // 日本の郵便番号の形式のみ受け付ける
    .matches(/^\d{3}-?\d{4}$/u, {
      message: "不正な郵便番号です。",
      excludeEmptyString: true,
    })
    .required("このフィールドを入力してください。"),
  addressRegion: Yup.string()
    .oneOf(prefectures, "都道府県を選択してください。")
    .required("このフィールドを入力してください。"),
  addressLocality: Yup.string().required("このフィールドを入力してください。"),
  streetAddress: Yup.string().required("このフィールドを入力してください。"),
  phoneNumber: Yup.string()
    .transform(convertToHalfWidth)
    .matches(/^[-\d]+$/u, {
      message: "不正な電話番号です。",
      excludeEmptyString: true,
    })
    .nullable(),
  email: Yup.string().email("不正なメールアドレスです。").nullable(),
  // 13桁の数字または空文字列（未記入）
  corporateNumber: Yup.string()
    .transform(convertToHalfWidth)
    .matches(/^\d{13}$/, {
      message: "不正な法人番号です。",
      excludeEmptyString: true,
    })
    .nullable(),
  businessCategory: Yup.string().nullable(),
  url: Yup.string()
    .url("不正な URL です。")
    .required("このフィールドを入力してください。"),
  contactTitle: Yup.string().nullable(),
  contactUrl: Yup.string().url("不正な URL です。").nullable(),
  publishingPrincipleTitle: Yup.string().nullable(),
  publishingPrincipleUrl: Yup.string().url("不正な URL です。").nullable(),
  privacyPolicyTitle: Yup.string().nullable(),
  privacyPolicyUrl: Yup.string().url("不正な URL です。").nullable(),
  description: Yup.string().nullable(),
});

function HolderForm({
  accountId,
  account,
  userId,
  mutateAccount,
}: {
  accountId: string;
  account: IFormInput;
  userId: string;
  mutateAccount: () => void;
}) {
  const session = useSession();
  const [draft, setDraft, clearDraft] = useAccountDraft(userId);
  const hasDraft = !!draft;

  const methods = useForm<IFormInput>({
    mode: "onBlur",
    defaultValues: draft || account,
    resolver: yupResolver<IFormInput>(formValidationSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    getValues,
    reset,
    trigger,
  } = methods;

  // 前回訪問時の下書きがある場合は、その下書きのエラーを表示する。
  // ユーザーがフォームを触っておらず (isDirty === false) 、
  // なおかつ下書きがある (hasDraft === true) の場合、
  // 下書きが前回訪問時のものだと判定する。
  useEffect(() => {
    if (!isDirty && hasDraft) {
      trigger();
    }
  }, [hasDraft, isDirty, trigger]);

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    if (!account) {
      return;
    }
    const token = await session.getAccessToken();
    const response = await updateAccount(
      data as OpAccountWithCredentials,
      accountId,
      token,
    );
    if (!response.ok) {
      // TODO: エラーを表示して
      throw new Error();
    } else {
      // 成功の場合、SWR のキャッシュの revalidate を行う。
      session.mutate();
      mutateAccount();
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
              className="hidden"
              onClick={(e) => {
                e.preventDefault();
                saveDraft();
              }}
            />
            <button
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
          <FormField
            name="domainName"
            label="組織代表ドメイン名"
            required
            placeHolder="media.example.com"
            onBlur={saveDraft}
          />
          <FormField
            name="name"
            label="所有者 / 法人・組織名"
            required
            placeHolder="○△新聞社"
            helpText="法人・組織の正式名称(省略無し)を記載してください"
            onBlur={saveDraft}
          />
          <FormField
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
                "border-orange-700 !border-2 !text-orange-700":
                  errors.addressRegion,
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
                <p className="text-sm text-orange-700">{message}</p>
              )}
            />
          </FormRow>
          <FormField
            name="addressLocality"
            label="市区町村"
            required
            placeHolder="千代田区"
            onBlur={saveDraft}
          />
          <FormField
            name="streetAddress"
            label="町名・番地・ビル名・部屋番号など"
            required
            placeHolder="大手町3丁目1-1 ○△ビル 1F"
            onBlur={saveDraft}
          />

          <FormField
            name="phoneNumber"
            inputClassName="w-48"
            label="電話番号"
            placeHolder="03-1111-1111"
            onBlur={saveDraft}
            inputProps={{ type: "tel" }}
          />

          <FormField
            name="email"
            inputClassName="w-5/6"
            label="メールアドレス"
            placeHolder="contact@example.com"
            onBlur={saveDraft}
            inputProps={{ type: "email" }}
          />

          <FormField
            name="corporateNumber"
            label="法人番号"
            placeHolder="1234567890123"
            onBlur={saveDraft}
            inputProps={{ type: "text", inputMode: "numeric" }}
          />

          <FormField
            name="businessCategory"
            label="事業種目"
            placeHolder="新聞業"
            onBlur={saveDraft}
          />

          <FormField
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

          <FormRow label="説明" htmlFor="descriptionTextarea">
            <textarea
              id="descriptionTextarea"
              className={clsx("jumpu-textarea flex-1", {
                "border-orange-700 !border-2 !text-orange-700":
                  errors.description,
              })}
              {...register("description", { onBlur: saveDraft })}
              placeholder="追加の説明情報（任意）"
            />
            <ErrorMessage
              errors={errors}
              name="description"
              render={({ message }) => (
                <p className="text-sm text-orange-700">{message}</p>
              )}
            />
          </FormRow>
        </div>
      </form>
    </FormProvider>
  );
}

export default function Holder() {
  const session = useSession();
  const user = session.data?.user;
  const { data: account, mutate: mutateAccount } = useAccount(
    user?.accountId ?? null,
  );

  const convert = (account: OpAccountWithCredentials): IFormInput => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, roleValue, credentials, businessCategory, ...rest } = account;
    return { ...rest, businessCategory: businessCategory?.[0] };
  };

  const accountData = useMemo(
    () => (account ? convert(account) : null),
    [account],
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
