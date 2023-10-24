type Props = {
  label: string;
  titleLabel: string;
  urlLabel: string;
  titlePlaceholder: string;
  urlPlaceholder: string;
  urlDefaultValue?: string;
  titleDefaultValue?: string;
  namePrefix: string;
};

export default function UrlAndTitleInput({
  label,
  titleLabel,
  urlLabel,
  titlePlaceholder,
  urlPlaceholder,
  urlDefaultValue,
  titleDefaultValue,
  namePrefix,
}: Props) {
  return (
    <label className="mb-3 py-2 flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
      <span className="text-sm flex-shrink-0 w-40 self-start">{label}</span>

      <div className="bg-gray-100 p-4 flex-col gap-20 w-full rounded-lg">
        <label className="mb-2 block">
          <span className="text-sm leading-normal mr-auto block mb-2">
            {titleLabel}
          </span>
          <input
            className="jumpu-input h-12 w-full"
            name={`${namePrefix}Title`}
            defaultValue={titleDefaultValue}
            placeholder={titlePlaceholder}
          />
        </label>

        <label className="mb-2 mb-2 gap-2 md:gap-4 md:items-center">
          <span className="text-sm leading-normal mr-auto block mb-2">
            {urlLabel}
          </span>
          <input
            className="jumpu-input flex-1 h-12 w-full"
            name={`${namePrefix}Url`}
            type="url"
            defaultValue={urlDefaultValue}
            placeholder={urlPlaceholder}
          />
        </label>
      </div>
    </label>
  );
}
