import { ipcMain } from 'electron';
import { MyAPI } from './electronInterProcessCommunication'
import * as fs from 'fs';

const ElectronStore = require('electron-store');
const store = new ElectronStore();

const subscriptions: MyAPI = {
  writeFile: (filePath, content) => fs.writeFileSync(filePath, content),
  readFile: (filePath) => fs.readFileSync(filePath),
  configSave: (config) => store.set('config', config),
  configLoad: () => store.get('config'),
};

// electron起動の中で、この関数を呼び出す。
// package.jsonの"main"プロパティに指定したエントリーポイントからの処理内で実行されていればOK。
export const subscribeIpcMainHandler = () => {
  for (let key in subscriptions) ipcMain.handle(key, (_event, ...args) => subscriptions[key](...args));
};
