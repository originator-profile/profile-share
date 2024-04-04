import { ComponentProps, SyntheticEvent } from "react";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import FormRow from "../components/FormRow";
import { HELP_TEXT, IFormInput } from "../utils/account-form";

type AccountFormFieldProps = {
  name: keyof IFormInput;
  label: string;
  inputClassName?: string;
  required?: boolean;
  helpText?: string;
  placeHolder?: string;
  onBlur: (e: SyntheticEvent) => void;
  inputProps?: ComponentProps<"input">;
};

export default function AccountFormField({
  name,
  inputClassName,
  label,
  required,
  placeHolder,
  onBlur,
  inputProps,
}: AccountFormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <FormRow
      label={label}
      required={required}
      htmlFor={`${name}Input`}
      helpText={HELP_TEXT[name]}
    >
      <input
        id={`${name}Input`}
        className={clsx("jumpu-input h-12", inputClassName, {
          "border-danger !border-2 !text-danger": errors[name],
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
          <p className="text-sm text-danger">{message}</p>
        )}
      />
    </FormRow>
  );
}
