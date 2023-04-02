import { createStateContext } from '@charon1212/my-lib-react';
import { WindowContext } from '../@types/electronInterProcessCommunication';

const [WindowContextProvider, useWindowContext] = createStateContext<WindowContext | undefined>(undefined);
export { WindowContextProvider, useWindowContext };
