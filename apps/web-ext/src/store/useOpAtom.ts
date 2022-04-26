import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import browser from "webextension-polyfill";
import Op from "@webdino/profile-model/src/op";

const opsAtom = atom<Op[]>([]);

function useOpsAtom() {
  const [ops, setOps] = useAtom(opsAtom);
  useEffect(() => {
    (async () => {
      // TODO: 拡張機能を呼び出したアクティブタブであることを保証する
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: false,
      });
      const response = await browser.tabs.sendMessage(tabs[0].id ?? NaN, {});
      setOps(response);
    })();
  }, [setOps]);
  return [ops, setOps];
}

export default useOpsAtom;
