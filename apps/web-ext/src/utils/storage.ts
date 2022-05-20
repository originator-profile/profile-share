import { createStorage } from "typesafe-storage";

const storage = createStorage<{
  tabId: number;
}>(localStorage);

export default storage;
