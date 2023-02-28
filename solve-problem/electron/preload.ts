// import { contextBridge, ipcRenderer } from "electron";
// import { Configuration } from "./type";

// contextBridge.exposeInMainWorld("myAPI", {
//   counter: (count: number) => { // 仮置きのAPI
//     return count + 1;
//   },
//   connectElectron: () => true,
//   writeFile: (filePath: string, content: string) => {
//     return ipcRenderer.invoke('file:write', filePath, content);
//   },
//   readFile: (filePath: string) => {
//     return ipcRenderer.invoke('file:read', filePath);
//   },
//   configSave: (config: Configuration) => {
//     return ipcRenderer.invoke('config:save', config);
//   },
//   configLoad: () => {
//     return ipcRenderer.invoke('config:load');
//   },
// });

import { contextBridge, ipcRenderer } from 'electron';
import { MyAPI } from './electronInterProcessCommunication'

const createInvoke = (key: string) => (...args: any) => ipcRenderer.invoke(key, ...args);
const myAPI: { [key in keyof MyAPI]: (...args: any) => Promise<any> } = {
  writeFile: createInvoke('writeFile'),
  readFile: createInvoke('readFile'),
  configSave: createInvoke('configSave'),
  configLoad: createInvoke('configLoad'),
};
contextBridge.exposeInMainWorld('myAPI', myAPI);
