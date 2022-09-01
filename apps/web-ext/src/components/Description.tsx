import clsx from "clsx";
import DOMPurify from "dompurify";

type Props = {
  className?: string;
  description: string;
};

function Description({ className, description }: Props) {
  const parser = new DOMParser();
  const descriptionDocument = parser.parseFromString(description, "text/html");
  for (const anchor of descriptionDocument.getElementsByTagName("a")) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
  return (
    <section className={clsx("py-1 border-gray-200 border-b", className)}>
      <h2 className="mb-1 text-gray-500 font-normal">説明</h2>
      <div
        className="prose prose-xs text-xs break-words"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(descriptionDocument.body.innerHTML),
        }}
      />
    </section>
  );
}

export default Description;
