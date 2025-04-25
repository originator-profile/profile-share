import { twMerge } from "tailwind-merge";
import FormRow from "../FormRow";
import { FieldProps } from "./types";

type Props = FieldProps & {
  /** 選択値 */
  value?: boolean;
  /** 初期値 */
  defaultValue?: boolean;
  /** Change イベント */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function CheckboxField(props: Props) {
  return (
    <FormRow
      label={props.label}
      htmlFor={props.id}
      helpText={props.helpText}
      required={props.required}
      className={twMerge(props.hidden && "hidden")}
    >
      <input
        id={props.id}
        type="checkbox"
        className="jumpu-input"
        name={props.name}
        defaultChecked={props.defaultValue}
        required={props.required}
        onChange={props.onChange}
        hidden={props.hidden}
      />
    </FormRow>
  );
}
