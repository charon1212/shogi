import { useState, useEffect } from 'react';
import { SimpleSelectList } from '@charon1212/my-lib-react';
import { ShogiProblemUnit } from '../../domain/problem';
import { ShogiBoardView } from '../../components/ShogiBoardView';
import { useEditShogiBoard } from '../../components/useEditShogiBoard';
import Button from '@mui/material/Button';
import { useEditProblem } from './useEditProblem';
import { deepCopy } from '../../util/deepCopy';

type Props = { problemUnit: ShogiProblemUnit; setProblemUnit: (problemUnit: ShogiProblemUnit) => unknown };
export const EditProblemUnit = (props: Props) => {
  const { problemUnit, setProblemUnit } = props;
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const selectListElements = [
    ...problemUnit.problems.map(({ questionMoveCount, moves }, i) => `${i}問目 ${questionMoveCount}～${moves.length}手目`),
    '新規作成',
  ];

  const [editOrigin, setEditOrigin] = useState(false);
  const [uiEditShogiBoard, editedShogiBoard, setEditedShogiBoard] = useEditShogiBoard();
  const onClickStartEdit = () => {
    if (!window.confirm('全ての小問を削除して原点局面を修正しますか？')) return;
    setEditedShogiBoard(problemUnit.origin);
    setEditOrigin(true);
  };
  const onClickEndEdit = () => {
    setProblemUnit({ origin: editedShogiBoard, problems: [] });
    setEditOrigin(false);
  };

  const [uiEditProblem, editProblem, setEditProblem] = useEditProblem({ origin: problemUnit.origin });
  useEffect(() => {
    if (selectIndex < problemUnit.problems.length) {
      const newProblems = [...problemUnit.problems];
      newProblems[selectIndex] = editProblem;
      setProblemUnit({ ...problemUnit, problems: newProblems });
    }
  }, [editProblem, setProblemUnit]);

  const onClickAdd = () => {
    setProblemUnit({ ...problemUnit, problems: [...problemUnit.problems, deepCopy(editProblem)] });
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '200px' }}>
          <Button disabled={selectIndex !== problemUnit.problems.length} onClick={onClickAdd}>
            追加
          </Button>
          <SimpleSelectList
            list={selectListElements.map((text, index) => ({ text, index }))}
            content={({ text }) => <>{text}</>}
            selected={({ index }) => index === selectIndex}
            onClick={({ index }) => {
              setSelectIndex(index);
              if (index < problemUnit.problems.length) {
                setEditProblem(problemUnit.problems[index]);
              }
            }}
          />
        </div>
        <div style={{ width: '600px' }}>{uiEditProblem}</div>
        <div>
          <div style={{ margin: '5px' }}>原点局面</div>
          <div>
            {editOrigin ? <Button onClick={onClickEndEdit}>原点局面の確定</Button> : <Button onClick={onClickStartEdit}>原点局面を編集する</Button>}
          </div>
          <div style={{ margin: '5px' }}>{editOrigin ? uiEditShogiBoard : <ShogiBoardView board={problemUnit.origin} />}</div>
        </div>
      </div>
    </>
  );
};
