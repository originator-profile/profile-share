import { useRef, useState } from "react";
import { useEvent } from "react-use";
import clsx from "clsx";
import type { ConfirmDialogProps, ConfirmDialogVariant } from "./types";

export function useDialog() {
  const ref = useRef<HTMLDialogElement>(null);

  function open() {
    const dialog = ref.current;
    if (!dialog) return;

    dialog.showModal();

    requestAnimationFrame(() => {
      dialog.ariaHidden = "false";
    });
  }

  return { ref, open };
}

export function ConfirmDialog<V extends ConfirmDialogVariant>(
  props: ConfirmDialogProps<V>,
) {
  const [returnValue, setReturnValue] = useState<string>("");
  const confirmation = () => props.onConfirm(returnValue);

  async function cancellation(
    dialog: HTMLDialogElement | null = props.dialogRef.current,
  ) {
    if (!dialog) return;
    if (!dialog.open) return;

    dialog.ariaHidden = "true";

    await new Promise((r) => {
      dialog.addEventListener("transitionend", r, { once: true });
    });

    dialog.close();
  }

  useEvent("click", (e) => {
    const dialog = props.dialogRef.current;
    if (e.target !== dialog) return;
    cancellation(dialog);
  });

  const color = {
    alert: "color-danger bg-danger",
    prompt: "color-primary",
  }[props.variant];

  return (
    <dialog
      ref={props.dialogRef}
      aria-hidden
      className={clsx(
        "jumpu-card",
        "max-w-2xl",
        "p-6",
        "rounded-2xl",
        "transition-opacity",
        "duration-300",
        "backdrop:bg-black/25",
        "backdrop:transition-opacity",
        "backdrop:duration-300",
        "aria-hidden:opacity-0",
        "aria-hidden:backdrop:opacity-0",
      )}
    >
      <form
        className="flex flex-col gap-6"
        method="dialog"
        onSubmit={confirmation}
      >
        <h4
          className={clsx(
            "text-lg",
            props.variant === "alert" && "text-danger",
          )}
        >
          {props.title}
        </h4>
        <p>{props.description}</p>

        {props.textareaProps && (
          <textarea
            {...props.textareaProps}
            className={clsx(
              "jumpu-textarea w-full",
              props.textareaProps?.className,
            )}
            rows={5}
            onChange={(e) => setReturnValue(e.target.value)}
          />
        )}

        <fieldset className="inline-flex gap-6">
          {props.confirmationText && (
            <button
              type="submit"
              className={clsx("jumpu-button font-bold", color)}
            >
              {props.confirmationText}
            </button>
          )}

          {props.cancellationText && (
            <button
              type="reset"
              className={clsx(
                "jumpu-outlined-button",
                "font-bold",
                "border-gray-700",
                "text-gray-500",
              )}
              onClick={() => cancellation()}
            >
              {props.cancellationText}
            </button>
          )}
        </fieldset>
      </form>
    </dialog>
  );
}
