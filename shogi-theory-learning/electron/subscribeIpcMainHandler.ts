import { ipcMain } from 'electron';
import { MyAPIMainHandler } from './electronInterProcessCommunication'
import * as fs from 'fs';
import * as log from 'electron-log';
import { decode } from 'iconv-lite';
import { createWindow } from './electron';
import { getWindowContext } from './windowContext';

/** 不要なら削除し、package.jsonからelectron-storeを削除。 */
const ElectronStore = require('electron-store');
const store = new ElectronStore();

const subscriptions: MyAPIMainHandler = {
  callSample: () => (sample) => console.log(`sample! ${sample.name}`),
  writeFile: () => (filePath, content) => fs.writeFileSync(filePath, content),
  readFile: () => (filePath) => fs.readFileSync(filePath),
  setStore: () => (key, value) => store.set(key, value),
  getStore: () => (key) => store.get(key),
  readSjisBufferToString: () => (buffer) => decode(buffer, 'sjis'),
  showSubShogiBoard: () => (moveList) => createWindow({ type: 'sub-shogi-board', moveList }, 600, 500),
  getWindowContext: (event) => () => {
    log.debug({ event });
    return getWindowContext(event.sender.id);
  },
};

// electron起動の中で、この関数を呼び出す。
// package.jsonの"main"プロパティに指定したエントリーポイントからの処理内で実行されていればOK。
export const subscribeIpcMainHandler = () => {
  for (let key in subscriptions) ipcMain.handle(key, (_event, ...args) => {
    log.info(`startIpcMainHandler - ${key}`);
    const result = subscriptions[key](_event)(...args);
    log.info(`endIpcMainHandler - ${key}`);
    return result;
  });
};
