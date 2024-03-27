import { atom } from "jotai";
import { atomWithStorage, createJSONStorage, useResetAtom } from "jotai/utils";
import { useAtom, useSetAtom } from "jotai/react";
import { IFormInput } from "./account-form";

const DRAFT_KEY = "account-form-draft";

type OpAccountDraft = Partial<IFormInput> | undefined;
type UserId = string;
type OpAccountDraftMap = Record<UserId, OpAccountDraft>;

const storage = createJSONStorage<OpAccountDraftMap>(() => localStorage);
const userIdAtom = atom<UserId>("");
const opAccountDraftMapAtom = atomWithStorage(DRAFT_KEY, {}, storage, {
  getOnInit: true,
});

const opAccountDraftAtom = atom(
  (get) => get(opAccountDraftMapAtom)[get(userIdAtom)],
  (get, set, draft: OpAccountDraft) =>
    set(opAccountDraftMapAtom, {
      ...get(opAccountDraftMapAtom),
      [get(userIdAtom)]: draft,
    }),
);

/*
 * 組織情報更新フォームの下書き保存に関するカスタムフック
 * @param userId ログインしているユーザーのID
 * @returns [draft, setDraft, clearDraft]
 */
export function useAccountDraft(
  userId?: UserId,
): [
  draft: OpAccountDraft,
  setDraft: (draft: OpAccountDraft) => void,
  clearDraft: () => void,
] {
  useSetAtom(userIdAtom)(userId ?? "");
  const [draft, setDraft] = useAtom(opAccountDraftAtom);
  const clearDraft = useResetAtom(opAccountDraftMapAtom);

  return [draft, setDraft, clearDraft];
}
