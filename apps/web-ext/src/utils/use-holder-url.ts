import { useSearchParams } from "react-router-dom";
import { Profile } from "../types/profile";

function useHolderUrl(subject: Profile["subject"]) {
  const [searchParams] = useSearchParams();
  const pathname = `/${encodeURIComponent(subject)}/holder`;
  const params = searchParams.toString();
  if (!params) return pathname;
  return `${pathname}?${params}`;
}

export default useHolderUrl;
