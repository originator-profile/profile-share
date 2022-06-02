import { Profile } from "../types/profile";

function useWebsiteUrl(subject: Profile["subject"]) {
  const pathname = `/${encodeURIComponent(subject)}/website`;
  return pathname;
}

export default useWebsiteUrl;
