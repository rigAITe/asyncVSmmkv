import { atom } from "recoil";

type LocalStorage = { [key: string]: any };

export const localStorage = atom<LocalStorage>({
  key: "localStorage",
  default: {},
});
