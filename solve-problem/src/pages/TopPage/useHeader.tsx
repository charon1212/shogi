import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useConfigDialog } from '../../dialogs/useConfigDialog';

type PageId = '' | 'ProblemListPage' | 'CreateProblemSetPage' | 'TestPage';
export const useHeader = () => {
  const [configDialog, openConfigDialog] = useConfigDialog();
  const [pageId, setPageId] = useState<PageId>('');

  const createPageIdHandler = (pageId: PageId) => () => setPageId(pageId);

  const ui = (
    <>
      {configDialog}
      <div style={{ backgroundColor: 'aquamarine', width: '100%', margin: '0' }}>
        <div style={{ display: 'flex', padding: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Typography variant='h3'>将棋問題管理ツール</Typography>
            </div>
            <div style={{ margin: '0 40px 0', display: 'flex' }}>
              <div style={{ margin: '0 10px 0' }}>
                <Button size='large' variant='contained' onClick={createPageIdHandler('ProblemListPage')}>
                  問題一覧
                </Button>
              </div>
              <div style={{ margin: '0 10px 0' }}>
                <Button size='large' variant='contained' onClick={createPageIdHandler('CreateProblemSetPage')}>
                  問題登録
                </Button>
              </div>
              <div style={{ margin: '0 10px 0' }}>
                <Button size='large' variant='contained' onClick={createPageIdHandler('TestPage')}>
                  テスト（デバッグ用）
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Button size='large' variant='contained' onClick={openConfigDialog}>
              設定変更
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  return [ui, pageId] as const;
};
