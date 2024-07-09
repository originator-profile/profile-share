import { FromSchema } from "json-schema-to-ts";
import Dp from "./dp";
import Op from "./op";

/** @deprecated */
const Profile = {
  deprecated: true,
  title: "Profile",
  anyOf: [Op, Dp],
} as const;

/** @deprecated */
type Profile = FromSchema<typeof Profile>;

export default Profile;
