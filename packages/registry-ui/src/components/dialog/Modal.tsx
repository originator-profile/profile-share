import { useRef } from "react";
import { useEvent } from "react-use";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import type { ModalProps } from "./types";

export function useModal() {
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

export function Modal(props: ModalProps) {
  async function onClose(
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
    void onClose(dialog);
  });

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
      <button
        type="button"
        className="absolute top-4 right-4"
        onClick={() => onClose(props.dialogRef.current)}
      >
        <Icon className="text-gray-400" icon="material-symbols:close" />
      </button>
      <div className="flex flex-col gap-3">
        <h4 className={clsx("text-lg font-bold text-gray-500")}>
          {props.title}
        </h4>
        <p className="text-base">{props.description}</p>
      </div>
    </dialog>
  );
}
