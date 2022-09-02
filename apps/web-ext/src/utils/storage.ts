import { createStorage } from "typesafe-storage";

const storage = createStorage<{
  tabId: number;
}>(sessionStorage);

export default storage;
