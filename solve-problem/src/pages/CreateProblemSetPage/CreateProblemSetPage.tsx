import { Button } from '@mui/material';
import { useState } from 'react';
import { useTextField } from '../../components/useTextField';
import { useConfigurationContext } from '../../context/ConfigurationContext';
import { ShogiProblemSet } from '../../domain/problem';
import { EditProblemSet } from './EditProblemSet';

export const CreateProblemSetPage = () => {
  const [problemSet, setProblemSet] = useState<ShogiProblemSet>({ title: '', problemUnits: [] });
  const [uiTitle, title, setTitle] = useTextField('', { fullWidth: true });
  const [configuration] = useConfigurationContext();
  const onClickSaveFile = () => {
    if (!configuration) return alert('右上から設定を保存してください。');
    if (!title) return alert('タイトルを設定してください。');
    const filePath = `${configuration?.baseDirPath}/${title}.ssp`;
    const fileContent = JSON.stringify({ ...problemSet, title });
    window.myAPI.writeFile(filePath, fileContent).then(() => alert('保存しました。'));
  };

  return (
    <>
      <div style={{ margin: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
          <div>タイトル：</div>
          <div style={{ width: '400px' }}>{uiTitle}</div>
          <div>
            <Button onClick={onClickSaveFile}>ファイル保存</Button>
          </div>
        </div>
        <EditProblemSet problemSet={problemSet} setProblemSet={setProblemSet} />
      </div>
    </>
  );
};
