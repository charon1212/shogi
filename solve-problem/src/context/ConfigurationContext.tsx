import { createStateContext } from '@charon1212/my-lib-react';
import { Configuration } from '../@types/electronInterProcessCommunication';

const [ConfigurationContextProvider, useConfigurationContext] = createStateContext<Configuration | undefined>(undefined);
export { ConfigurationContextProvider, useConfigurationContext };
