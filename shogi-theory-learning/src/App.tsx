import { useEffect } from 'react';
import { ConfigurationContextProvider, useConfigurationContext } from './context/ConfigurationContext';
import { useWindowContext, WindowContextProvider } from './context/WindowContext';
import { TopPage } from './pages/TopPage/TopPage';
import { SubShogiBoard } from './subwindows/SubShogiBoard/SubShogiBoard';

export const App = () => {
  return (
    <>
      <ConfigurationContextProvider>
        <WindowContextProvider>
          <App2 />
        </WindowContextProvider>
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

  const [windowContext, setWindowContext] = useWindowContext();
  useEffect(() => {
    let flag = true;
    window.myAPI.getWindowContext().then((windowContext) => {
      console.log({ windowContext });
      if (flag && windowContext) {
        if (windowContext) {
          setWindowContext(windowContext);
        } else {
          console.error('window contextが取得できない。(ポーリング方式に変更予定)');
        }
      }
    });
    return () => {
      flag = false;
    };
  }, []);

  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        {windowContext?.type === 'main' ? <TopPage /> : ''}
        {windowContext?.type === 'sub-shogi-board' ? <SubShogiBoard /> : ''}
      </div>
    </>
  );
};
