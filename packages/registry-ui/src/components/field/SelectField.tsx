import FormRow from "../FormRow";
import { FieldProps } from "./types";

type Props = FieldProps & {
  /** 選択値 */
  value?: string;
  /** 選択肢 */
  values: Array<{ value: string; label?: string }>;
  /** 初期値 */
  defaultValue?: string;
  /** Change イベント */
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
};

export function SelectField(props: Props) {
  return (
    <FormRow
      label={props.label}
      htmlFor={props.id}
      helpText={props.helpText}
      required={props.required}
    >
      <select
        id={props.id}
        className="jumpu-select"
        value={props.value}
        name={props.name}
        onChange={props.onChange}
        defaultValue={props.defaultValue}
        required={props.required}
      >
        {props.values.map((item) => (
          <option value={item.value} key={item.value}>
            {item.label ?? item.value}
          </option>
        ))}
      </select>
    </FormRow>
  );
}
