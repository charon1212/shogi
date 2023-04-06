import { DialogBase } from '@charon1212/my-lib-react/build/components/DialogBase/DialogBase';
import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { convertShogiKifuToShogiTheory, ShogiTheory } from '../domain/ShogiTheory';
import { readKifFile } from '@charon1212/shogi-domain';

export type UseKifFileImportDialogArgs = { onImport: (shogiTheory: ShogiTheory) => unknown };
export const useKifFileImportDialog = (args: UseKifFileImportDialogArgs) => {
  const { onImport } = args;
  const [filePath, setFilePath] = useState('');

  const [open, setOpen] = useState(false);
  const openDialog = () => {
    setOpen(true);
    setFilePath('');
  };

  const content = (
    <>
      <Typography>kifファイルのインポート</Typography>
      <div style={{ margin: '20px' }}>
        <TextField fullWidth label='ファイルパス' value={filePath} onChange={(e) => setFilePath(e.target.value)} />
      </div>
    </>
  );

  const onClickOk = async () => {
    const fileName = filePath
      .split('\\')
      .flatMap((v) => v.split('/'))
      .pop()!;
    window.myAPI
      .readFile(filePath, { encoding: 'sjis' })
      .then((fileStr) => {
        const { shogiKifu } = readKifFile(fileStr);
        const theory = convertShogiKifuToShogiTheory(shogiKifu);
        theory.title = fileName;
        onImport(theory);
        setOpen(false);
      })
      .catch((err) => {
        alert('ファイル読み込みエラー(ログ出力)');
        console.error(err);
        console.error({ json: JSON.stringify(err) });
      });
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
      title={'kifファイルインポートダイアログ'}
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
