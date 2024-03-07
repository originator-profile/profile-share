import type { AlertDialogProps } from "./types";
import { ConfirmDialog } from "./ConfirmDialog";

export function AlertDialog(props: AlertDialogProps) {
  return <ConfirmDialog<"alert"> variant="alert" {...props} />;
}
