import { Typography, Button } from '@mui/material';
import { useState } from 'react';
import { useConfigDialog } from '../../dialogs/useConfigDialog';
import { ShogiTheory } from '../../domain/ShogiTheory';
import { EditTheory } from './EditTheory';
import { Menu } from './Menu';

const headerSize = '100px';
const menuSize = '250px';

export const TopPage = () => {
  const [configDialog, openConfigDialog] = useConfigDialog();
  const [selectedTheory, setSelectedTheory] = useState<ShogiTheory | undefined>();

  return (
    <>
      <div style={{ backgroundColor: 'aquamarine', width: '100%', height: `${headerSize}`, display: 'flex', alignItems: 'center' }}>
        <div style={{ margin: '0 50px 0', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h3'>定跡学習ソフト</Typography>
          <Button variant='contained' onClick={openConfigDialog}>
            設定ダイアログ
          </Button>
        </div>
      </div>
      <div style={{ width: '100%', height: `calc(100vh - ${headerSize})`, display: 'flex' }}>
        <div style={{ backgroundColor: 'mediumaquamarine', height: '100%', width: `${menuSize}` }}>
          <Menu selectedTheory={selectedTheory} setSelectedTheory={setSelectedTheory} />
        </div>
        <div style={{ height: '100%', width: `calc(100vw - ${menuSize})`, margin: '0', padding: '0' }}>
          {selectedTheory ? <EditTheory shogiTheory={selectedTheory} /> : ''}
        </div>
      </div>
      {configDialog}
    </>
  );
};
