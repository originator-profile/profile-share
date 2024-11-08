import {
  useSiteProfile,
  SiteProfile as Template,
} from "../components/siteProfile";

export default function SiteProfile() {
  const siteProfile = useSiteProfile();

  if (!siteProfile.data) return null;

  return <Template siteProfile={siteProfile.data} />;
}
