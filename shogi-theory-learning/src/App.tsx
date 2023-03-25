import { useEffect } from 'react';
import { ConfigurationContextProvider, useConfigurationContext } from './context/ConfigurationContext';

export const App = () => {
  return (
    <>
      <ConfigurationContextProvider>
        <App2 />
      </ConfigurationContextProvider>
    </>
  );
};

const App2 = () => {
  const [_, setConfig] = useConfigurationContext();
  useEffect(() => {
    window.myAPI.getStore('config').then((value: any) => {
      if (value !== undefined) setConfig(value);
    });
  }, []);

  return <></>;
};
