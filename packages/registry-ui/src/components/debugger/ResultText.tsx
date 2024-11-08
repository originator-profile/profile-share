import { ResultTextProps } from "./types";
export function ResultText(props: ResultTextProps) {
  return (
    <pre className="jumpu-card block text-sm font-mono bg-gray-50 px-3 py-2 overflow-auto">
      {props.children}
    </pre>
  );
}
