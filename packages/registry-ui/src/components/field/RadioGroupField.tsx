import { twMerge } from "tailwind-merge";
import FormRow from "../FormRow";
import { FieldProps } from "./types";

type Props = Omit<FieldProps, "id"> & {
  /** 選択値 */
  value?: string;
  /** 選択肢 */
  values: Array<{ value: string; label?: string }>;
  /** 初期値 */
  defaultValue?: string;
  /** Change イベント */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function RadioGroupField(props: Props) {
  return (
    <FormRow
      label={props.label}
      helpText={props.helpText}
      required={props.required}
      className={twMerge(props.hidden && "hidden")}
    >
      <fieldset className="flex gap-4 items-center">
        {props.values.map((item) => (
          <label className="flex items-center py-1 gap-1" key={item.value}>
            <input
              name={props.name}
              type="radio"
              value={item.value}
              defaultChecked={props.defaultValue === item.value}
              onChange={props.onChange}
              hidden={props.hidden}
            />
            {item.label ?? item.value}
          </label>
        ))}
      </fieldset>
    </FormRow>
  );
}
