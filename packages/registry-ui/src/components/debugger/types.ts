/** 提示形式 */
export type PresentationType = "embedded" | "external";

/** テキスト出力 */
export type TextOutput = {
  type: "text";
  title: string;
  src: string;
};

/** JSON 出力 */
export type JsonOutput = {
  type: "json";
  title: string;
  src: object;
};

export type Output = TextOutput | JsonOutput;

export type Outputs = Output[];

export type DetailItemProps = Output & { className?: string };

export type DebugResult<T> =
  | {
      ok: true;
      result: T;
    }
  | {
      ok: false;
      output: Output;
    };
