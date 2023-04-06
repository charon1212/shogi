import { SimpleSelectList } from '@charon1212/my-lib-react';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { loadShogiTheory, ShogiTheory } from '../../domain/ShogiTheory';
import { MyTree } from 'util-charon1212';
import { useKifFileImportDialog } from '../../dialogs/useKifFileImport';
import { useConfigurationContext } from '../../context/ConfigurationContext';

type Props = { selectedTheory: ShogiTheory | undefined; setSelectedTheory?: (theory: ShogiTheory) => unknown };
export const Menu = (props: Props) => {
  const { selectedTheory, setSelectedTheory } = props;
  const [config] = useConfigurationContext();

  const [theoryList, setTheoryList] = useState<ShogiTheory[]>([]);
  const add = () => {
    const newTheory: ShogiTheory = { title: 'new theory', summary: '', theory: new MyTree() };
    setTheoryList([...theoryList, newTheory]);
  };
  const [kifFileImportDialog, openKifFileImportDialog] = useKifFileImportDialog({
    onImport: (theory) => {
      setTheoryList([...theoryList, theory]);
    },
  });

  useEffect(() => {
    let flag = true;
    if (config?.baseDirPath) {
      window.myAPI.getFileList(config?.baseDirPath).then((fileList) => {
        fileList
          .filter((v) => v.endsWith('.stl'))
          .map((v) => `${config?.baseDirPath}/${v}`)
          .forEach((filePath) => {
            window.myAPI.readFile(filePath, { encoding: 'utf8' }).then((str) => {
              if (flag) {
                const shogiTheory = loadShogiTheory(str);
                if (!theoryList.some((v) => v.title === shogiTheory.title)) setTheoryList((before) => [...before, loadShogiTheory(str)]);
              }
            });
          });
      });
    }

    return () => {
      flag = false;
    };
  }, []);

  return (
    <>
      {kifFileImportDialog}
      <div style={{ margin: '20px' }}>
        <Button variant='contained' onClick={add} style={{ margin: '5px' }}>
          追加
        </Button>
        <Button variant='contained' onClick={openKifFileImportDialog} style={{ margin: '5px' }}>
          インポート
        </Button>
        <SimpleSelectList
          list={theoryList}
          content={(theory) => <>{theory.title}</>}
          selected={(theory) => theory === selectedTheory}
          onClick={(theory) => setSelectedTheory?.(theory)}
        />
      </div>
    </>
  );
};
