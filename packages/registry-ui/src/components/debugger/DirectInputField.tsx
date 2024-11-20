import clsx from "clsx";
import { DirectInputFieldProps } from "./types";
import FormRow from "../FormRow";

export function DirectInputField({
  hidden = false,
  id,
  name,
  defaultValue,
}: DirectInputFieldProps) {
  return (
    <FormRow className={clsx({ hidden })} label="Source" htmlFor={id}>
      <textarea
        id={id}
        className="jumpu-textarea resize flex-1"
        name={name}
        cols={12}
        rows={18}
        style={{ fontFamily: "monospace" }}
        defaultValue={defaultValue ? JSON.stringify(defaultValue) : ""}
        hidden={hidden}
      />
    </FormRow>
  );
}
