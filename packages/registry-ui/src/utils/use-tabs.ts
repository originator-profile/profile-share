import { useLocation } from "react-router-dom";

const registerTabs = [
  {
    route: "holder",
    name: "組織情報",
    status: null,
  },
  {
    route: "public-key",
    name: "公開鍵",
    status: null,
  },
  {
    route: "logo",
    name: "ロゴマーク",
    status: null,
  },
  {
    route: "credential",
    name: "資格情報",
    status: null,
  },
] as const;

export default function useTabs() {
  const location = useLocation();

  // URLのパスを見て、どのタブが選択されているかを判定する
  const isTabSelected = (pathSubstring: string) =>
    location.pathname.split("/").filter(Boolean).pop() === pathSubstring;

  const registerTabsSelected = registerTabs
    .map((tab) => isTabSelected(tab.route))
    .some((selected) => selected);
  return {
    registerTabs,
    isTabSelected,
    registerTabsSelected,
  };
}
