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
    window.myAPI.getStore('config').then((value: any) => {
      if (value !== undefined) setConfig(value);
    });
  }, []);

  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        <TopPage />
      </div>
    </>
  );
};
