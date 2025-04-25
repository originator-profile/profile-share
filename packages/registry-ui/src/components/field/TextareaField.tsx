import { twMerge } from "tailwind-merge";
import FormRow from "../FormRow";
import { FieldProps } from "./types";

type Props = FieldProps & {
  /** 初期値 */
  defaultValue?: string;
  /** 読み込み専用 */
  readOnly?: boolean;
};

export function TextareaField(props: Props) {
  return (
    <FormRow
      className={twMerge(props.hidden && "hidden")}
      label={props.label}
      htmlFor={props.id}
      helpText={props.helpText}
      required={props.required}
    >
      <textarea
        id={props.id}
        className={twMerge(
          "jumpu-textarea resize flex-1 font-mono",
          props.readOnly && "bg-gray-100",
        )}
        name={props.name}
        cols={12}
        rows={8}
        defaultValue={props.defaultValue}
        required={props.required}
        hidden={props.hidden}
        readOnly={props.readOnly}
      />
    </FormRow>
  );
}
