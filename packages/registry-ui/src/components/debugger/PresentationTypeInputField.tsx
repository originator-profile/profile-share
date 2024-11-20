import { PresentationTypeInputFieldProps } from "./types";
import FormRow from "../FormRow";

export function PresentationTypeInputField({
  value,
  name,
  onChange,
}: PresentationTypeInputFieldProps) {
  return (
    <FormRow
      label="Presentation Type"
      helpText="デバッグ対象の提示方法を指定します。"
    >
      <div className="flex gap-4 items-center">
        <label className="flex items-center py-1 gap-1">
          <input
            name={name}
            type="radio"
            value="url"
            checked={value === "url"}
            onChange={onChange}
          />
          URL
        </label>
        <label className="flex items-center py-1 gap-1">
          <input
            name={name}
            type="radio"
            value="direct"
            checked={value === "direct"}
            onChange={onChange}
          />
          Direct Input
        </label>
      </div>
    </FormRow>
  );
}
