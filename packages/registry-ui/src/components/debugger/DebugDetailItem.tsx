import { Output, DetailItemProps } from "./types";
import ReactJson from "@microlink/react-json-view";

function DebugContent(props: Output) {
  if (props.type === "text") {
    return (
      <pre className="jumpu-card block text-sm font-mono bg-gray-50 px-3 py-2 overflow-auto">
        {props.src}
      </pre>
    );
  }

  return <ReactJson src={props.src} collapsed />;
}

export function DebugDetailItem(props: DetailItemProps) {
  return (
    <div className={props.className}>
      <dt className="text-sm font-bold -mx-2 p-2 sticky top-0 bg-white z-[calc(infinity)]">
        {props.title}
      </dt>
      <dd>
        <DebugContent {...props} />
      </dd>
    </div>
  );
}
