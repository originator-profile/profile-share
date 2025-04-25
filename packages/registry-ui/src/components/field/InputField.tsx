import { twMerge } from "tailwind-merge";
import FormRow from "../FormRow";
import { FieldProps } from "./types";

type Props = FieldProps & {
  /** 初期値 */
  defaultValue?: string;
  /** 読み込み専用 */
  readOnly?: boolean;
};

export function InputField(props: Props) {
  return (
    <FormRow
      className={twMerge(props.hidden && "hidden")}
      label={props.label}
      htmlFor={props.id}
      helpText={props.helpText}
      required={props.required}
    >
      <input
        id={props.id}
        className={twMerge(
          "jumpu-input flex-1",
          props.readOnly && "bg-gray-100",
        )}
        name={props.name}
        defaultValue={props.defaultValue}
        hidden={props.hidden}
        readOnly={props.readOnly}
      />
      {props.errors && props.errors.length > 0 && (
        <ul className="pl-3 text-danger">
          {props.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </FormRow>
  );
}
