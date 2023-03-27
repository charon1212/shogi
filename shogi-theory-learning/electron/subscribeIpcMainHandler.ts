import { ipcMain } from 'electron';
import { MyAPI } from './electronInterProcessCommunication'
import * as fs from 'fs';
import * as log from 'electron-log';
import { decode } from 'iconv-lite';

/** 不要なら削除し、package.jsonからelectron-storeを削除。 */
const ElectronStore = require('electron-store');
const store = new ElectronStore();

const subscriptions: MyAPI = {
  callSample: (sample) => console.log(`sample! ${sample.name}`),
  writeFile: (filePath, content) => fs.writeFileSync(filePath, content),
  readFile: (filePath) => fs.readFileSync(filePath),
  setStore: (key, value) => store.set(key, value),
  getStore: (key) => store.get(key),
  readSjisBufferToString: (buffer) => decode(buffer, 'sjis'),
};

// electron起動の中で、この関数を呼び出す。
// package.jsonの"main"プロパティに指定したエントリーポイントからの処理内で実行されていればOK。
export const subscribeIpcMainHandler = () => {
  for (let key in subscriptions) ipcMain.handle(key, (_event, ...args) => {
    log.info(`startIpcMainHandler - ${key}`);
    const result = subscriptions[key](...args);
    log.info(`endIpcMainHandler - ${key}`);
    return result;
  });
};
