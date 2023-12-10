import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const MemberInfoAtom = atom({
  key: "MemberInfoAtom",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
