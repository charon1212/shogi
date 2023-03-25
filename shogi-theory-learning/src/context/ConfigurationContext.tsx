import { createStateContext } from '@charon1212/my-lib-react';

export type Configuration = { baseDirPath: string };

const [ConfigurationContextProvider, useConfigurationContext] = createStateContext<Configuration | undefined>(undefined);
export { ConfigurationContextProvider, useConfigurationContext };
