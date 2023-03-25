import { useState, useEffect } from 'react';
import { useEditShogiBoard } from '../components/useEditShogiBoard';
import { useEditShogiSingleKifu } from '../components/useEditShogiSingleKifu';
import { useConfigurationContext } from '../context/ConfigurationContext';
import { useConfigDialog } from '../dialogs/useConfigDialog';
import { ShogiProblemSet } from '../domain/problem';
import { ShogiBoard } from '../domain/shogi';
import { createShogiBoardInit } from '../domain/shogiBoardTemplate';
import { EditProblemSet } from './CreateProblemSetPage/EditProblemSet';

export const TestPage = () => {
  const [board, setBoard] = useState<ShogiBoard>(createShogiBoardInit());

  const [uiEditShogiBoard] = useEditShogiBoard();

  const [config, setConfig] = useConfigurationContext();
  const [configDialog, openConfigDialog] = useConfigDialog();

  const { uiEditShogiSingleKifu } = useEditShogiSingleKifu({ startBoard: createShogiBoardInit() });

  const [problemSet, setProblemSet] = useState<ShogiProblemSet>({
    title: 'test',
    problemUnits: [
      {
        origin: createShogiBoardInit(),
        problems: [{ moves: [], startMoveCount: 0, questionMoveCount: 10, questionComment: '', answerComment: '' }],
      },
    ],
  });

  return (
    <>
      <div style={{ margin: '100px' }}>
        {/* <div style={{ margin: '20px' }}>{uiEditShogiSingleKifu}</div> */}
        <EditProblemSet problemSet={problemSet} setProblemSet={setProblemSet} />
      </div>
    </>
  );
};
