import { InputField, TextareaField, FieldProps } from "../field";

type Props = FieldProps & {
  /** 初期値 */
  defaultValue?: string;
  /** 提示方法 */
  presentationType?: string;
};

export function PresentationField({ presentationType, ...field }: Props) {
  if (presentationType === "external") {
    return <InputField {...field} />;
  }
  return <TextareaField {...field} />;
}
