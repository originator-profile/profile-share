import { DebugTargetSelectFieldProps } from "./types";
import FormRow from "../FormRow";

export function DebugTargetSelectField(props: DebugTargetSelectFieldProps) {
  return (
    <FormRow label="Debug Target">
      <select
        className="jumpu-select"
        value={props.value}
        name={props.name}
        onChange={props.onChange}
        defaultValue={props.defaultValue}
      >
        <option value="SD-JWT OP">SD-JWT OP</option>
        <option value="Profile Set">Profile Set</option>
      </select>
    </FormRow>
  );
}
