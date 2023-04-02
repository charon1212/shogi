import * as log from 'electron-log';
import { WindowContext } from "./electronInterProcessCommunication";

const windowContextMap: { id: number, context: WindowContext }[] = [];
export const setWindowContext = (id: number, context: WindowContext) => {
  log.info(`Add Window Context: ${JSON.stringify({ id, context })}`);
  windowContextMap.push({ id, context });
};
export const getWindowContext = (id: number): WindowContext | undefined => windowContextMap.find((v) => v.id === id)?.context;
