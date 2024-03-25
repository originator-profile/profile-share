import { ComponentProps, RefObject } from "react";

export type ConfirmDialogVariant = "alert" | "prompt";

export type ConfirmDialogProps<Variant extends ConfirmDialogVariant> = {
  variant: Variant;
  dialogRef: RefObject<HTMLDialogElement>;
  title: string;
  description?: string;
  /** メッセージ入力欄 (デフォルト非表示) */
  textareaProps?: ComponentProps<"textarea">;
  confirmationText?: string;
  cancellationText?: string;
  /**
   * 確定時に呼ばれる関数
   * キャンセルしたときは呼ばれません
   * @param message 入力したメッセージ (デフォルト: "")
   */
  onConfirm(message: string): void;
};

export type AlertDialogProps = Omit<ConfirmDialogProps<"alert">, "variant">;
export type PromptDialogProps = Omit<ConfirmDialogProps<"prompt">, "variant">;

export type ModalProps = {
  dialogRef: RefObject<HTMLDialogElement>;
  title: string;
  description: string;
};
