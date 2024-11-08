import clsx from "clsx";
import { EndpointInputFieldProps } from "./types";
import FormRow from "../FormRow";

export function EndpointInputField({
  hidden = false,
  id,
  name,
  defaultValue,
}: EndpointInputFieldProps) {
  const helpText =
    "Debug Target を取得するエンドポイントです。URL ではない場合、ドメイン名とみなして https スキームと連結します。URL パスを含まない場合、サイトプロファイル Well-known URL パスと連結します。";
  return (
    <FormRow
      className={clsx({ hidden })}
      label="Endpoint"
      htmlFor={id}
      helpText={helpText}
    >
      <input
        id={id}
        className="jumpu-input flex-1"
        name={name}
        defaultValue={defaultValue}
        hidden={hidden}
      />
    </FormRow>
  );
}
