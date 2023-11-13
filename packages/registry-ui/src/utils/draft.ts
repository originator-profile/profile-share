import { useCallback, useEffect, useState } from "react";

const DRAFT_KEY = "account-form-draft";

/*
 * localStorage から値を取得して JSON としてパースする
 * @typeParam T 保存されている値をパースした結果の型
 * @param key localStorage に保存されているキー
 * @returns localStorage に保存されている値
 */
const getData = <T>(key: string): T | null => {
  const saved = localStorage.getItem(key);
  if (!saved) {
    return null;
  }
  const initialValue = JSON.parse(saved);
  return initialValue;
};

/*
 * 組織情報の下書きを localStorage に保存するためのキーを生成する
 * @param userId ログインしているユーザーのID
 */
const getKey = (userId: string) => {
  return `${DRAFT_KEY}-${userId}`;
};

/*
 * 組織情報更新フォームの入力内容の下書きに関するカスタムフック
 * @typeParam T 組織情報更新フォームの入力内容の型
 * @param userId ログインしているユーザーのID
 * @returns [draft, hasDraft, clearDraft, saveDraft]
 */
export function useAccountDraft<T>(
  userId?: string,
): [
  hasDraft: boolean,
  getDraft: () => T | null,
  clearDraft: () => void,
  saveDraft: (value: T) => void,
] {
  const [hasDraft, setHasDraft] = useState<boolean>(false);

  useEffect(() => {
    const draft =
      typeof userId !== "undefined" ? getData<T>(getKey(userId)) : null;
    if (draft) {
      setHasDraft(true);
    }
  }, [userId]);

  const saveDraft = useCallback(
    (value: T) => {
      if (typeof userId !== "string") {
        console.error("Cannot save draft with non-string key", userId);
        return;
      }
      setHasDraft(true);
      localStorage.setItem(getKey(userId), JSON.stringify(value));
    },
    [userId],
  );

  const clearDraft = useCallback(() => {
    if (typeof userId !== "string") {
      console.error("Cannot clear draft with non-string key", userId);
      return;
    }
    localStorage.removeItem(getKey(userId));
    setHasDraft(false);
  }, [userId]);

  const getDraft = useCallback<() => T | null>(
    () => (typeof userId !== "undefined" ? getData(getKey(userId)) : null),
    [userId],
  );

  return [hasDraft, getDraft, clearDraft, saveDraft];
}
