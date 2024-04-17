import { ComponentProps, SyntheticEvent } from "react";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import FormRow from "../components/FormRow";
import { HELP_TEXT, IFormInput } from "../utils/account-form";

type AccountFormFieldProps = {
  name: keyof IFormInput;
  label: string;
  required?: boolean;
  helpText?: string;
  placeHolder?: string;
  onBlur: (e: SyntheticEvent) => void;
} & (
  | {
      inputClassName?: never;
      inputProps?: never;
      textareaClassName?: string;
      textareaProps?: ComponentProps<"textarea">;
      textarea: true;
    }
  | {
      inputClassName?: string;
      inputProps?: ComponentProps<"input">;
      textareaClassName?: never;
      textareaProps?: never;
      textarea?: false;
    }
);

export default function AccountFormField({
  name,
  inputClassName,
  textareaClassName,
  label,
  required,
  placeHolder,
  onBlur,
  inputProps,
  textareaProps,
  textarea = false,
}: AccountFormFieldProps) {
  const htmlFor = textarea ? `${name}Textarea` : `${name}Input`;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <FormRow
      label={label}
      required={required}
      htmlFor={htmlFor}
      helpText={HELP_TEXT[name]}
    >
      {textarea ? (
        <textarea
          id={htmlFor}
          className={clsx("jumpu-textarea flex-1", textareaClassName, {
            "border-danger !border-2 !text-danger": errors[name],
          })}
          placeholder={placeHolder}
          {...register(name, {
            onBlur: onBlur,
          })}
          {...textareaProps}
        />
      ) : (
        <input
          id={htmlFor}
          className={clsx("jumpu-input h-12", inputClassName, {
            "border-danger !border-2 !text-danger": errors[name],
          })}
          placeholder={placeHolder}
          {...register(name, {
            onBlur: onBlur,
          })}
          {...inputProps}
        />
      )}
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className="text-sm text-danger">{message}</p>
        )}
      />
    </FormRow>
  );
}
