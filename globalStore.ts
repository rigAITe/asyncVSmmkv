import { atom } from "recoil";

type GlobalStore = { [key: string]: any };

export const globalStore = atom<GlobalStore>({
  key: "globalStore",
  default: {},
});
