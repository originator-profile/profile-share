import { FromSchema } from "json-schema-to-ts";
import Op from "./op";
import Dp from "./dp";

const Profile = {
  title: "Profile",
  anyOf: [Op, Dp],
} as const;

type Profile = FromSchema<typeof Profile>;

export default Profile;
