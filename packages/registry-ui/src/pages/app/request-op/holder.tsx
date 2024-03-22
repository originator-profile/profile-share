import { SyntheticEvent, useCallback, useEffect } from "react";
import clsx from "clsx";
import {
  useForm,
  SubmitHandler,
  FormProvider,
  useFormContext,
  RegisterOptions,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import FormRow from "../../../components/FormRow";
import { useSession } from "../../../utils/session";
import {
  OpAccountWithCredentials,
  updateAccount,
  useAccount,
} from "../../../utils/account";
import UrlAndTitleInput from "../../../components/UrlAndTitleInput";
import { useAccountDraft } from "../../../utils/draft";
import {
  prefectures,
  normalizePhoneNumber,
  normalizeJapanPostalCode,
  validateUrlString,
} from "../../../utils/account-form";

export interface IFormInput {
  domainName: string;
  name: string;
  postalCode: string;
  addressRegion: string;
  addressLocality: string;
  streetAddress: string;
  phoneNumber: string;
  email: string;
  corporateNumber: string;
  businessCategory: string;
  url: string;
  contactTitle: string;
  contactUrl: string;
  publishingPrincipleTitle: string;
  publishingPrincipleUrl: string;
  privacyPolicyTitle: string;
  privacyPolicyUrl: string;
  description: string;
}

type FormFieldProps = {
  name: keyof IFormInput;
  label: string;
  inputClassName?: string;
  required?: boolean;
  helpText?: string;
  placeHolder?: string;
  registerOptions: RegisterOptions<Partial<IFormInput>, keyof IFormInput>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

function FormField({
  name,
  inputClassName,
  label,
  required,
  helpText,
  placeHolder,
  registerOptions,
  inputProps,
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <FormRow
      className="mb-7"
      label={label}
      required={required}
      htmlFor={`${name}Input`}
      // TODO helpText を本物に差し替えて
      // helpText={helpText}
    >
      <input
        id={`${name}Input`}
        className={clsx("jumpu-input h-12", inputClassName, {
          "border-orange-700 !border-2 !text-orange-700": errors[name],
        })}
        placeholder={placeHolder}
        {...register(name, {
          required: required && "このフィールドを入力してください。",
          ...registerOptions,
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

export default function Holder() {
  const session = useSession();
  const user = session.data?.user;
  const { data: account, mutate: mutateAccount } = useAccount(
    user?.accountId ?? null,
  );
  const [draft, setDraft, clearDraft] = useAccountDraft(user?.id);
  const hasDraft = !!draft;

  const methods = useForm<Partial<IFormInput>>({
    mode: "onBlur",
    // フォームのデータは useEffect() 内で初期化するので最初は undefined にしておく。
    defaultValues: undefined,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
    reset,
  } = methods;

  /*
   * フォームの入力項目の値をリセットする。
   * この関数が呼ばれたタイミングで下書きがあれば下書きの値に、なければ account の値に戻す。
   */
  const resetFormState = useCallback(() => {
    reset(
      draft || {
        ...account,
        businessCategory:
          account?.businessCategory && account.businessCategory[0],
      },
    );
  }, [draft, account, reset]);

  useEffect(() => {
    // account に新しいデータが入ったときにフォームを（再）初期化する。
    resetFormState();
  }, [resetFormState]);

  const onSubmit: SubmitHandler<Partial<IFormInput>> = async (
    data: Partial<IFormInput>,
  ) => {
    if (!account) {
      return;
    }
    const token = await session.getAccessToken();
    const response = await updateAccount(
      data as OpAccountWithCredentials,
      account.id,
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

  // TODO: タブのデザインを修正して（選択されていないタブにも枠を表示する。下線の長さを横いっぱいに伸ばす）
  // TODO: タブに「要修正」や「下書きあり」を表示して
  // TODO: 審査コメントを各入力欄の下に表示して
  return (
    account && (
      <FormProvider {...methods}>
        <form
          className="max-w-2xl mb-8"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Enter キーで下書き保存する。*/}
          <button
            className="hidden"
            onClick={(e) => {
              e.preventDefault();
              saveDraft();
            }}
          />
          <div className="flex mb-6 flex-row md:items-center">
            <h2 className="text-3xl font-bold">組織情報</h2>
            <button
              className="jumpu-text-button text-danger mr-1 ml-auto"
              onClick={(e) => {
                e.preventDefault();
                clearDraft();
                resetFormState();
              }}
              disabled={!hasDraft}
            >
              下書きをリセット
            </button>
            <input
              className="jumpu-outlined-button px-8 text-base text-[#00AFB4] font-bold border-[#00AFB4]"
              type="submit"
              value="保存する"
              disabled={!hasDraft || !isValid}
            />
          </div>
          <p className="text-sm mb-6">
            Originator Profile 情報を登録頂くフォームです。
            <br />
            サイト運営者・コンテンツ提供者などの組織情報を法人毎に登録してください。注:
            法人単位での登録です。
            <br />
            グループ会社一括やサイト・サービス単位ではありません。
          </p>
          <FormField
            name="domainName"
            label="組織代表ドメイン名"
            required
            placeHolder="media.example.com"
            registerOptions={{
              onBlur: saveDraft,
            }}
          />
          <FormField
            name="name"
            label="所有者 / 法人・組織名"
            required
            placeHolder="○△新聞社"
            helpText="法人・組織の正式名称(省略無し)を記載してください"
            registerOptions={{
              onBlur: saveDraft,
            }}
          />
          <FormField
            name="postalCode"
            label="郵便番号"
            inputClassName="w-40"
            required
            placeHolder="100-0001"
            registerOptions={{
              pattern: {
                value: /^[ー\p{Dash}\p{Nl}\d]{7,8}$/u,
                message: "不正な郵便番号です。",
              },
              onBlur: (e: SyntheticEvent) => {
                const element = e.target as HTMLInputElement;
                const value = normalizeJapanPostalCode(element.value);
                setValue("postalCode", value);
                saveDraft();
              },
            }}
          />

          <FormRow
            className="mb-7"
            label="都道府県"
            required
            htmlFor="addressRegionSelect"
          >
            <select
              id="addressRegionSelect"
              className={clsx("jumpu-select w-48 h-12", {
                "border-orange-700 !border-2 !text-orange-700":
                  errors.addressRegion,
              })}
              {...register("addressRegion", {
                required: "このフィールドを入力してください。",
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
            registerOptions={{
              onBlur: saveDraft,
            }}
          />
          <FormField
            name="streetAddress"
            label="町名・番地・ビル名・部屋番号など"
            required
            placeHolder="大手町3丁目1-1 ○△ビル 1F"
            registerOptions={{
              onBlur: saveDraft,
            }}
          />

          <FormField
            name="phoneNumber"
            inputClassName="w-48"
            label="電話番号"
            placeHolder="03-1111-1111"
            registerOptions={{
              pattern: {
                value: /^[ー\p{Dash}\p{Nl}\d]+$/u,
                message: "電話番号を入力してください。",
              },
              onBlur: (e) => {
                const value = normalizePhoneNumber(e.target.value);
                setValue("phoneNumber", value);
                saveDraft();
              },
            }}
            inputProps={{ type: "tel" }}
          />

          <FormField
            name="email"
            inputClassName="w-5/6"
            label="メールアドレス"
            placeHolder="contact@example.com"
            registerOptions={{ onBlur: saveDraft }}
            inputProps={{ type: "email" }}
          />

          <FormField
            name="corporateNumber"
            label="法人番号"
            placeHolder="1234567890123"
            registerOptions={{
              pattern: {
                value: /^\d{13}$/,
                message: "不正な法人番号です。",
              },
              onBlur: saveDraft,
            }}
            inputProps={{ type: "text", inputMode: "numeric" }}
          />

          <FormField
            name="businessCategory"
            label="事業種目"
            placeHolder="新聞業"
            registerOptions={{
              onBlur: saveDraft,
            }}
          />

          <FormField
            name="url"
            label="WebサイトURL"
            placeHolder="https://www.example.com/"
            required
            registerOptions={{
              validate: validateUrlString,
              onBlur: saveDraft,
            }}
            inputProps={{ type: "url" }}
          />

          {/* TODO: helpText が必要な項目に付け足して */}
          <UrlAndTitleInput
            label="お問い合わせ情報"
            titleLabel="お問い合わせページの名称"
            urlLabel="リンク"
            titleInput={
              <>
                <input
                  className={clsx("jumpu-input h-12 w-full", {
                    "border-orange-700 !border-2 !text-orange-700":
                      errors.contactTitle,
                  })}
                  {...register("contactTitle", { onBlur: saveDraft })}
                  placeholder="○△へのお問い合わせ"
                />
                <ErrorMessage
                  errors={errors}
                  name="contactTitle"
                  render={({ message }) => (
                    <p className="text-sm text-orange-700">{message}</p>
                  )}
                />
              </>
            }
            urlInput={
              <>
                <input
                  className={clsx("jumpu-input h-12 w-full", {
                    "border-orange-700 !border-2 !text-orange-700":
                      errors.contactUrl,
                  })}
                  {...register("contactUrl", {
                    onBlur: saveDraft,
                    validate: validateUrlString,
                  })}
                  type="url"
                  placeholder="https://www.example.com/contact/"
                />
                <ErrorMessage
                  errors={errors}
                  name="contactUrl"
                  render={({ message }) => (
                    <p className="text-sm text-orange-700">{message}</p>
                  )}
                />
              </>
            }
          />
          <UrlAndTitleInput
            label="編集ガイドライン"
            titleLabel="ページの名称"
            urlLabel="リンク"
            titleInput={
              <>
                <input
                  className={clsx("jumpu-input h-12 w-full", {
                    "border-orange-700 !border-2 !text-orange-700":
                      errors.publishingPrincipleTitle,
                  })}
                  {...register("publishingPrincipleTitle", {
                    onBlur: saveDraft,
                  })}
                  placeholder="○△ガイドライン"
                />
                <ErrorMessage
                  errors={errors}
                  name="publishingPrincipleTitle"
                  render={({ message }) => (
                    <p className="text-sm text-orange-700">{message}</p>
                  )}
                />
              </>
            }
            urlInput={
              <>
                <input
                  className={clsx("jumpu-input h-12 w-full", {
                    "border-orange-700 !border-2 !text-orange-700":
                      errors.publishingPrincipleUrl,
                  })}
                  {...register("publishingPrincipleUrl", {
                    onBlur: saveDraft,
                    validate: validateUrlString,
                  })}
                  type="url"
                  placeholder="https://www.example.com/guidelines/"
                />
                <ErrorMessage
                  errors={errors}
                  name="publishingPrincipleUrl"
                  render={({ message }) => (
                    <p className="text-sm text-orange-700">{message}</p>
                  )}
                />
              </>
            }
          />
          <UrlAndTitleInput
            label="プライバシーボリシー"
            titleLabel="ページの名称"
            urlLabel="リンク"
            titleInput={
              <>
                <input
                  className={clsx("jumpu-input h-12 w-full", {
                    "border-orange-700 !border-2 !text-orange-700":
                      errors.privacyPolicyTitle,
                  })}
                  {...register("privacyPolicyTitle", { onBlur: saveDraft })}
                  placeholder="○△プライバシーセンター"
                />
                <ErrorMessage
                  errors={errors}
                  name="privacyPolicyTitle"
                  render={({ message }) => (
                    <p className="text-sm text-orange-700">{message}</p>
                  )}
                />
              </>
            }
            urlInput={
              <>
                <input
                  className={clsx("jumpu-input h-12 w-full", {
                    "border-orange-700 !border-2 !text-orange-700":
                      errors.privacyPolicyUrl,
                  })}
                  {...register("privacyPolicyUrl", {
                    onBlur: saveDraft,
                    validate: validateUrlString,
                  })}
                  type="url"
                  placeholder="https://www.example.com/privacy/"
                />
                <ErrorMessage
                  errors={errors}
                  name="privacyPolicyUrl"
                  render={({ message }) => (
                    <p className="text-sm text-orange-700">{message}</p>
                  )}
                />
              </>
            }
          />

          <FormRow className="mb-7" label="説明">
            <textarea
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
        </form>
      </FormProvider>
    )
  );
}
