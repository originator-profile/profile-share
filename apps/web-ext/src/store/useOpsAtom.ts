import { useAsync } from "react-use";
import { atom, useAtom } from "jotai";
import browser from "webextension-polyfill";
import { Op } from "@webdino/profile-model";
import { JwtOpPayload } from "../types/op";
import { toOp } from "../utils/op";

const opsAtom = atom<Op[]>([]);

function useOpsAtom() {
  const [ops, setOps] = useAtom(opsAtom);
  useAsync(async () => {
    // TODO: 拡張機能を呼び出したアクティブタブであることを保証する
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: false,
    });
    const response: JwtOpPayload[] = await browser.tabs.sendMessage(
      tabs[0].id ?? NaN,
      {}
    );
    setOps(response.map(toOp));
  }, [setOps]);
  return {
    ops,
    setOps,
  };
}

export default useOpsAtom;
