import { useEffect } from 'react';
import { ConfigurationContextProvider, useConfigurationContext } from './context/ConfigurationContext';
import { TopPage } from './pages/TopPage/TopPage';

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
    window.myAPI.configLoad().then((config) => {
      console.log({ config });
      setConfig(config);
    });
  }, []);

  return (
    <>
      <TopPage />
    </>
  );
};
