type Props = {
  label: string;
  titleLabel: string;
  urlLabel: string;
  titleInput: React.ReactNode;
  urlInput: React.ReactNode;
  titleError?: string;
  urlError?: string;
};

export default function UrlAndTitleInput({
  label,
  titleLabel,
  urlLabel,
  titleInput,
  urlInput,
  titleError,
  urlError,
}: Props) {
  return (
    <div className="mb-7 flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
      <span className="text-sm leading-normal flex-shrink-0 w-40 self-start">
        {label}
      </span>
      <div className="bg-gray-100 p-4 flex flex-col w-full rounded-lg gap-4">
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm leading-normal">{titleLabel}</span>
            {titleInput}
          </label>

          {titleError && (
            <p className="text-sm leading-normal text-orange-700">
              {titleError}
            </p>
          )}
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-sm leading-normal">{urlLabel}</span>
          {urlInput}
        </label>
        {urlError && (
          <p className="text-sm leading-normal text-orange-700">{urlError}</p>
        )}
      </div>
    </div>
  );
}
