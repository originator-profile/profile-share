import { SyntheticEvent } from "react";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

type PageFieldSetProps = {
  name: string;
  label: string;
  titleLabel: string;
  urlLabel: string;
  titlePlaceholder: string;
  urlPlaceholder: string;
  onBlur: (e: SyntheticEvent) => void;
};

export default function PageFieldSet({
  name,
  label,
  titleLabel,
  urlLabel,
  titlePlaceholder,
  urlPlaceholder,
  onBlur,
}: PageFieldSetProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const urlName = `${name}Url`;
  const titleName = `${name}Title`;
  const urlInputId = `${name}UrlInput`;
  const titleInputId = `${name}TitleInput`;

  return (
    <fieldset className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
      <div className="text-sm leading-normal flex-shrink-0 w-40 self-start">
        {label}
      </div>
      <div className="bg-gray-100 p-4 flex flex-col w-full rounded-lg gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={titleInputId}>
            <span className="text-sm leading-normal">{titleLabel}</span>
          </label>
          <input
            id={titleInputId}
            className={clsx("jumpu-input h-12 w-full", {
              "border-danger !border-2 !text-danger": errors[titleName],
            })}
            {...register(titleName, { onBlur: onBlur })}
            placeholder={titlePlaceholder}
          />
          <ErrorMessage
            errors={errors}
            name={titleName}
            render={({ message }) => (
              <p className="text-sm text-danger">{message}</p>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={urlInputId}>
            <span className="text-sm leading-normal">{urlLabel}</span>
          </label>
          <input
            id={urlInputId}
            type="url"
            className={clsx("jumpu-input h-12 w-full", {
              "border-danger !border-2 !text-danger": errors[urlName],
            })}
            {...register(urlName, {
              onBlur: onBlur,
            })}
            placeholder={urlPlaceholder}
          />
          <ErrorMessage
            errors={errors}
            name={urlName}
            render={({ message }) => (
              <p className="text-sm text-danger">{message}</p>
            )}
          />
        </div>
      </div>
    </fieldset>
  );
}
