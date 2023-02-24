import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("myAPI", {
  counter: (count: number) => { // 仮置きのAPI
    return count + 1;
  },
});