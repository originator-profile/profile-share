import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import browser from "webextension-polyfill";
import Op from "@webdino/profile-model/src/op";

const opsAtom = atom<Op[]>([]);

function useOpsAtom() {
  const [ops, setOps] = useAtom(opsAtom);
  useEffect(() => {
    (async () => {
      const response = await browser.runtime.sendMessage({});
      setOps(response);
    })();
  }, [setOps]);
  return [ops, setOps];
}

export default useOpsAtom;
