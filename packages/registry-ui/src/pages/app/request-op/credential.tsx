import { ComponentProps, ReactNode, useState } from "react";
import { CertificationSystem } from "@originator-profile/model";
import { Table, TableRow } from "@originator-profile/ui";
import {
  expirationDateTimeLocaleFrom,
  isExpired,
} from "@originator-profile/core";
import clsx from "clsx";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Icon } from "@iconify/react";
import { Menu } from "@headlessui/react";
import FormRow from "../../../components/FormRow";
import { type OpCredential, useAccount } from "../../../utils/account";
import { useSession } from "../../../utils/session";
import {
  createCredential,
  deleteCredential,
  updateCredential,
  FormData,
} from "../../../utils/credential";
import { useCertificationSystems } from "../../../utils/certification-systems";

type FormFieldProps = {
  name: keyof FormData;
  label: string;
  placeholder?: string;
  type?: string;
  /** 入力欄 */
  inputProps?: ComponentProps<"input">;
  /** HTMLDataListElement values */
  options?: string[];
};

type FormSelectFieldProps = {
  name: keyof FormData;
  label: string;
  children: ReactNode;
};

type CertifierOptions = Array<{
  id: string;
  name: string;
}>;

type VerifierOptions = Array<{
  id: string;
  name: string;
}>;

function FormField({
  name,
  label,
  placeholder,
  type = "text",
  inputProps,
  options = [],
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();
  return (
    <FormRow htmlFor={`${name}Input`} label={label} wide={false}>
      <input
        {...inputProps}
        id={`${name}Input`}
        list={`${name}List`}
        type={type}
        className={clsx(
          "jumpu-input h-12",
          {
            "border-orange-700 !border-2 !text-orange-700": errors[name],
          },
          inputProps?.className,
        )}
        placeholder={placeholder}
        {...register(name, {
          required: "このフィールドを入力してください。",
        })}
      />
      <datalist id={`${name}List`}>
        {options.map((value, i) => (
          <option key={i} value={value}></option>
        ))}
      </datalist>
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

function FormSelectField({ name, label, children }: FormSelectFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();
  return (
    <FormRow htmlFor={`${name}Select`} label={label} wide={false}>
      <select
        id={`${name}Select`}
        className={clsx("jumpu-input h-12", {
          "border-orange-700 !border-2 !text-orange-700": errors[name],
        })}
        {...register(name, {
          required: "このフィールドを入力してください。",
        })}
      >
        {children}
      </select>
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

function CredentialForm({
  data,
  ...props
}: {
  data?: OpCredential;
  onSubmit: SubmitHandler<FormData>;
}) {
  const localeOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  } as const;
  const methods = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      ...data,
      certifier: data?.certifier.id,
      verifier: data?.verifier.id,
      expiredAt:
        data?.expiredAt &&
        expirationDateTimeLocaleFrom(data?.expiredAt, "ja-JP", localeOptions)
          .split(" ")[0]
          .replace(/\//g, "-"),
      issuedAt:
        data?.issuedAt &&
        new Date(data?.issuedAt)
          .toLocaleDateString("ja-JP", localeOptions)
          .replace(/\//g, "-"),
    },
  });

  const certificationSystems = useCertificationSystems();
  const { watch, handleSubmit, setValue } = methods;

  const [certifierOptions, setCertifierOptions] = useState<CertifierOptions>(
    data?.certifier ? [data.certifier] : [],
  );

  const [verifierOptions, setVerifierOptions] = useState<VerifierOptions>(
    data?.verifier ? [data.verifier] : [],
  );

  watch((values, { name, type }) => {
    if (type !== "change") return;

    switch (name) {
      case "name": {
        const i = certificationSystems.nameOptions.findIndex(
          (nameOption) => nameOption === values.name,
        );

        const cs: CertificationSystem | undefined =
          certificationSystems.data?.[i];

        if (cs?.certifier) {
          setValue("certifier", cs.certifier.id);
          setCertifierOptions([cs.certifier]);
        }

        if (cs?.verifier) {
          setValue("verifier", cs.verifier.id);
          setVerifierOptions([cs.verifier]);
        }
      }
    }
  });

  const onSubmit = handleSubmit((values) => {
    props.onSubmit({
      ...values,
      name: values.name.replace(/ (第三者検証|自己宣言)$/, ""),
    });
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-5 rounded-lg bg-gray-50 px-8 py-6"
      >
        <FormField
          name="name"
          label="認定内容"
          options={certificationSystems.nameOptions}
          inputProps={{
            autoComplete: "off",
          }}
        />
        <FormSelectField name="certifier" label="認証機関">
          <option disabled value="">
            未選択
          </option>
          {certifierOptions.map((co) => (
            <option key={co.id} value={co.id}>
              {co.name}
            </option>
          ))}
        </FormSelectField>
        <FormSelectField name="verifier" label="検証機関">
          <option disabled value="">
            未選択
          </option>
          {verifierOptions.map((vo) => (
            <option key={vo.id} value={vo.id}>
              {vo.name}
            </option>
          ))}
        </FormSelectField>
        <FormField
          name="issuedAt"
          label="認定書発行日"
          type="date"
          inputProps={{
            className: "w-80",
          }}
        />
        <FormField
          name="expiredAt"
          label="有効期限"
          type="date"
          inputProps={{
            className: "w-80",
          }}
        />
        <button
          type="submit"
          className="jumpu-button font-base font-bold text-left w-full h-10 flex flex-col justify-center"
        >
          <span>登録する</span>
        </button>
      </form>
    </FormProvider>
  );
}

function CredentialTableRow({
  className,
  header,
  data,
}: {
  className?: string;
  header: string;
  data: string;
}) {
  return (
    <TableRow
      header={<span className="text-black text-sm">{header}</span>}
      data={<span className={clsx(className, "text-base")}>{data}</span>}
    />
  );
}

function MenuButton({
  handleClickEdit,
  handleClickDelete,
}: {
  handleClickEdit: React.MouseEventHandler<HTMLButtonElement>;
  handleClickDelete: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Menu>
      <Menu.Button className="flex justify-center items-center w-11 h-11 m-2">
        <Icon icon="mdi:dots-horizontal" className="w-4 h-4" />
      </Menu.Button>
      <Menu.Items className="absolute right-2 top-9 rounded w-48 bg-white shadow-lg z-10">
        <Menu
          as="div"
          className="text-sm text-center py-2 border-b border-gray-200"
        >
          <button type="button" onClick={handleClickEdit}>
            訂正する
          </button>
        </Menu>
        <Menu as="div" className="text-sm text-center py-2">
          <button type="button" onClick={handleClickDelete}>
            削除する
          </button>
        </Menu>
      </Menu.Items>
    </Menu>
  );
}

function CredentialTable({
  data,
  handleDelete,
  handleEdit,
}: {
  data: OpCredential;
  handleDelete: (id: string) => void;
  handleEdit: (id: string, formData: FormData) => void;
}) {
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const handleClickEdit = () => {
    setShowEditForm(true);
  };

  if (showEditForm) {
    return (
      <CredentialForm
        data={data}
        onSubmit={(formData: FormData) => {
          handleEdit(data.id, formData);
          setShowEditForm(false);
        }}
      />
    );
  }

  return (
    <div className="relative text-base px-4 py-6 bg-gray-50 rounded-lg">
      <div className="absolute top-0 right-0">
        <MenuButton
          handleClickEdit={handleClickEdit}
          handleClickDelete={() => handleDelete(data.id)}
        />
      </div>
      <Table>
        <CredentialTableRow header="認定内容" data={data.name} />
        <CredentialTableRow header="認証機関" data={data.certifier.name} />
        <CredentialTableRow header="検証機関" data={data.verifier.name} />
        <CredentialTableRow
          className="text-gray-700"
          header="認定書発行日"
          data={new Date(data.issuedAt).toLocaleString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
        <CredentialTableRow
          className={clsx({
            ["text-danger"]: isExpired(data.expiredAt),
          })}
          header="有効期限"
          data={expirationDateTimeLocaleFrom(data.expiredAt, "ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
      </Table>
    </div>
  );
}

export default function Credential() {
  const session = useSession();
  const user = session.data?.user;
  const { data: account, mutate: mutateAccount } = useAccount(
    user?.accountId ?? null,
  );
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const expiredCredentials = account?.credentials?.filter((credential) =>
    isExpired(credential.expiredAt),
  );
  const validCredentials = account?.credentials?.filter(
    (credential) => !isExpired(credential.expiredAt),
  );

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (!account?.id) {
      return;
    }
    const token = await session.getAccessToken();
    await createCredential(data, account?.id, token);
    setShowCreateForm(false);
    mutateAccount();
  };

  const handleDelete = async (credentialId: string) => {
    if (!account?.id) {
      return;
    }
    const token = await session.getAccessToken();
    await deleteCredential(account?.id, credentialId, token);
    mutateAccount();
  };

  const handleEdit = async (credentialId: string, formData: FormData) => {
    if (!account?.id) {
      return;
    }
    const token = await session.getAccessToken();
    await updateCredential(formData, account?.id, credentialId, token);
    mutateAccount();
  };

  return (
    <div className="flex flex-col gap-6 max-w-screen-sm">
      <h2 className="text-2xl font-bold">資格情報</h2>
      <p>
        第三者認証機関の承認を得たら、このページより Originator Profile（OP）
        事務局にお知らせください。 OP 事務局で確認が取れましたら、
        <b>
          {account?.name && `${account.name}様の`}
          認証情報が更新されます。
        </b>
      </p>
      <div>
        <div className="flex flex-row items-center gap-4 pt-4 mb-2">
          <h3 className="text-xl font-bold">登録済み</h3>
          <div className="jumpu-badge text-xs bg-gray-50 border border-gray-300">
            {validCredentials && validCredentials.length}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {showCreateForm ? (
            <CredentialForm onSubmit={onSubmit} />
          ) : (
            <button
              className="jumpu-outlined-button border-dashed border-gray-300 px-4 py-6 w-full"
              onClick={() => setShowCreateForm(true)}
            >
              新しい資格情報を追加する
            </button>
          )}

          {validCredentials &&
            validCredentials.length > 0 &&
            validCredentials.map((credential) => {
              return (
                <CredentialTable
                  data={credential}
                  key={credential.id}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              );
            })}
        </div>
      </div>
      <div>
        {expiredCredentials && expiredCredentials.length > 0 && (
          <>
            <div className="flex flex-row items-center gap-4 mb-3">
              <h3 className="text-xl font-bold">失効</h3>
              <div className="jumpu-badge text-xs bg-gray-50 border border-gray-300">
                {expiredCredentials.length}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {expiredCredentials.map((credential) => {
                return (
                  <CredentialTable
                    data={credential}
                    key={credential.id}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
