/** フィールド */
export type FieldProps = {
  /** 非表示 */
  hidden?: boolean;
  /** 識別子 */
  id: string;
  /** コントロール名 */
  name: string;
  /** ラベル */
  label: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** 必須項目 */
  required?: boolean;
  /** エラーテキスト */
  errors?: string[];
};
