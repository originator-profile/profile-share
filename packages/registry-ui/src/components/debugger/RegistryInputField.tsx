import FormRow from "../FormRow";
import { RegistryInputFieldProps } from "./types";

export function RegistryInputField({
  id,
  name,
  defaultValue,
}: RegistryInputFieldProps) {
  return (
    <FormRow
      label="Registry"
      htmlFor={id}
      helpText="OP を発行したレジストリです。レジストリのドメイン名を入力します。"
    >
      <input
        id={id}
        className="jumpu-input flex-1"
        name={name}
        required
        defaultValue={defaultValue}
      />
    </FormRow>
  );
}
