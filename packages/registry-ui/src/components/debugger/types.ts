export type DebugTargetValue = "NO TEST";

export type DebugTargetSelectFieldProps = {
  /** 選択値 */
  value?: string;
  /** コントロール名 */
  name: string;
  /** Change イベント */
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  /** 初期値 */
  defaultValue?: string;
};

export type DirectInputFieldProps = {
  /** 非表示フラグ (デフォルト: false) */
  hidden?: boolean;
  /** 識別子 */
  id: string;
  /** コントロール名 */
  name: string;
  /** JSON 文字列化される初期値 */
  defaultValue?: unknown;
};

export type EndpointInputFieldProps = {
  /** 非表示フラグ (デフォルト: false) */
  hidden?: boolean;
  /** 識別子 **/
  id: string;
  /** コントロール名 */
  name: string;
  /** 初期値 */
  defaultValue?: string;
};

export type PresentationTypeValue = "url" | "direct";

export type PresentationTypeInputFieldProps = {
  /** 入力値 */
  value: PresentationTypeValue;
  /** コントロール名 */
  name: string;
  /** Change イベント */
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export type RegistryInputFieldProps = {
  /** 識別子 **/
  id: string;
  /** コントロール名 */
  name: string;
  /** 初期値 */
  defaultValue?: string;
};

export type ResultTextProps = {
  /** 子要素 */
  children: React.ReactNode;
};
