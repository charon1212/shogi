import { DialogBase } from '@charon1212/my-lib-react/build/components/DialogBase/DialogBase';
import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useConfigurationContext, Configuration } from '../context/ConfigurationContext';

export const useConfigDialog = () => {
  const [baseDirPath, setBaseDirPath] = useState('');
  const [config, setConfig] = useConfigurationContext();

  const [open, setOpen] = useState(false);
  const openDialog = () => {
    setOpen(true);
    console.log({ config });
    setBaseDirPath(config?.baseDirPath ?? '');
  };

  const content = (
    <>
      <Typography>設定</Typography>
      <div style={{ margin: '20px' }}>
        <TextField fullWidth label='基準ディレクトリパス' value={baseDirPath} onChange={(e) => setBaseDirPath(e.target.value)} />
      </div>
    </>
  );

  const onClickOk = () => {
    const config: Configuration = { baseDirPath };
    setConfig(config);
    window.myAPI.setStore('config', config).finally(() => setOpen(false));
  };
  const actions = (
    <>
      <Button onClick={onClickOk}>確定</Button>
      <Button onClick={() => setOpen(false)}>閉じる</Button>
    </>
  );
  const dialog = (
    <DialogBase
      open={open}
      title={'設定変更ダイアログ'}
      content={content}
      actions={actions}
      props={{
        dialog: { maxWidth: false },
        dialogContent: { sx: { width: '30vw' } },
      }}
    />
  );

  return [dialog, openDialog] as const;
};
