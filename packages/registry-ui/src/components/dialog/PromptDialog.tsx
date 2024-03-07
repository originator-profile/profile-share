import type { PromptDialogProps } from "./types";
import { ConfirmDialog } from "./ConfirmDialog";

export function PromptDialog(props: PromptDialogProps) {
  return <ConfirmDialog<"prompt"> variant="prompt" {...props} />;
}
