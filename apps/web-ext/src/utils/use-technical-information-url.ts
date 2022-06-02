import { useSearchParams } from "react-router-dom";
import { Profile } from "../types/profile";

function useTechnicalInformationUrl(subject: Profile["subject"]) {
  const [searchParams] = useSearchParams();
  const pathname = `/${encodeURIComponent(subject)}/technical-information`;
  const params = searchParams.toString();
  if (!params) return pathname;
  return `${pathname}?${params}`;
}

export default useTechnicalInformationUrl;
