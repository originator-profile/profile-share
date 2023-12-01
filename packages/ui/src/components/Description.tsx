import clsx from "clsx";
import useSanitizedHtml from "../utils/use-sanitized-html";

type Props = {
  className?: string;
  description: string;
};

function Description({ className, description }: Props) {
  const html = useSanitizedHtml(description);
  return (
    <section className={clsx("py-1", className)}>
      <h2 className="mb-1 text-gray-500 font-normal">説明</h2>
      <div
        className="prose prose-xs text-xs break-words"
        dangerouslySetInnerHTML={{
          __html: html ?? "",
        }}
      />
    </section>
  );
}

export default Description;
