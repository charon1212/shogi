import * as log from 'electron-log';
import { WindowContext } from "./electronInterProcessCommunication";

const windowContextMap: { id: number, context: WindowContext }[] = [];
export const setWindowContext = (id: number, context: WindowContext) => {
  log.info(`Add Window Context: ${JSON.stringify({ id, context })}`);
  windowContextMap.push({ id, context });
};
export const getWindowContext = (id: number): WindowContext | undefined => {
  const windowContext = windowContextMap.find((v) => v.id === id)?.context
  if (!windowContext) log.warn(`cannot find window context. id=${id}. Registered window context id = ${JSON.stringify(windowContextMap.map((v) => v.id))}`);
  return windowContext;
};
