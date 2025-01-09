# dialog

操作の過程で一時的に開かれる小さい画面

[types.ts](./types.ts)

```ts
export type ConfirmDialogProps<Variant extends ConfirmDialogVariant> = {
  variant: Variant;
  dialogRef: RefObject<HTMLDialogElement | null>;
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
```

## AlertDialog

注意を促すダイアログ

```tsx
const dialog = useDialog();

// <button onClick={() => dialog.open()}>申請取り下げ</button>;

<AlertDialog
  dialogRef={dialog.ref}
  title="申請を取り下げます"
  description="よろしいですか？"
  confirmationText="はい、申請を取り下げます"
  cancellationText="いいえ、申請をつづけます"
  onConfirm={() => console.log("ok")}
/>;
```

## PromptDialog

入力を促すダイアログ

```tsx
const dialog = useDialog();

// <button onClick={() => dialog.open()}>申請</button>;

<PromptDialog
  dialogRef={dialog.ref}
  title="申請をはじめます"
  description="よろしいですか？"
  textareaProps={{
    placeholder: "メッセージ (任意)",
  }}
  confirmationText="申請をはじめる"
  onConfirm={(message: string) => console.log(message)}
/>;
```
