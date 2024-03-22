import { useCallback, useMemo } from "react";
import { atom } from "jotai";
import { RESET, atomWithStorage, createJSONStorage } from "jotai/utils";
import { useAtom } from "jotai/react";
import { IFormInput } from "../pages/app/request-op/holder";

const DRAFT_KEY = "account-form-draft";

const storage = createJSONStorage<
  Record<string, Partial<IFormInput> | undefined>
>(() => localStorage);
const accountDraftAtom = atomWithStorage(DRAFT_KEY, {}, storage, {
  getOnInit: true,
});

/*
 * 組織情報更新フォームの下書き保存に関するカスタムフック
 * @param userId ログインしているユーザーのID
 * @returns [draft, setDraft, clearDraft]
 */
export function useAccountDraft(
  userId?: string,
): [
  draft: Partial<IFormInput> | undefined,
  setDraft: (draft: Partial<IFormInput> | typeof RESET) => void,
  clearDraft: () => void,
] {
  const [draft, setDraft] = useAtom(
    useMemo(
      () =>
        atom<
          Partial<IFormInput> | undefined,
          [Partial<IFormInput> | typeof RESET],
          void
        >(
          (get) => {
            const draft = get(accountDraftAtom);
            return typeof userId !== "undefined" ? draft?.[userId] : undefined;
          },
          (get, set, update) => {
            if (typeof userId === "undefined") return;
            set(accountDraftAtom, {
              ...get(accountDraftAtom),
              [userId]: update === RESET ? undefined : update,
            });
          },
        ),
      [userId],
    ),
  );
  const clearDraft = useCallback(() => setDraft(RESET), [setDraft]);
  return [draft, setDraft, clearDraft];
}
