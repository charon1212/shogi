import { useState } from 'react';
import { useEditShogiSingleKifu } from '../../components/useEditShogiSingleKifu';
import { useTextField } from '../../components/useTextField';
import { ShogiProblem } from '../../domain/problem';
import { ShogiBoard } from '../../domain/shogi';

type ArgsUseEditProblem = {
  origin: ShogiBoard;
};
export const useEditProblem = ({ origin }: ArgsUseEditProblem) => {
  const { moves, setMoves, moveCount, uiEditShogiSingleKifu } = useEditShogiSingleKifu({ startBoard: origin });
  const [textFieldQuestionComment, questionComment, setQuestionComment] = useTextField('', { fullWidth: true, multiline: true, minRows: 5 });
  const [textFieldAnswerComment, answerComment, setAnswerComment] = useTextField('', { fullWidth: true, multiline: true, minRows: 5 });
  const [startMoveCount, setStartMoveCount] = useState<number>(0);
  const [questionMoveCount, setQuestionMoveCount] = useState<number>(0);
  const [answerMoveCount, setAnswerMoveCount] = useState<number>(0);

  const onClickRegisterStartMove = () => setStartMoveCount(moveCount);
  const onClickRegisterQuestionMove = () => setQuestionMoveCount(moveCount);
  const onClickRegisterAnswerMove = () => setAnswerMoveCount(moveCount);

  const getMoveText = (c: number) => (c === 0 ? `0手目まで` : `${c}手目「${moves[c - 1]?.text}」まで`);
  const ui = (
    <>
      <div>
        <div style={{ margin: '5px', display: 'flex', justifyContent: 'center' }}>{uiEditShogiSingleKifu}</div>
        <div style={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px' }}>
            <div>開始局面　{getMoveText(startMoveCount)}</div>
            <div>
              <button onClick={onClickRegisterStartMove}>開始局面に登録</button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px' }}>
            <div>問題局面　{getMoveText(questionMoveCount)}</div>
            <div>
              <button onClick={onClickRegisterQuestionMove}>問題局面に登録</button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px' }}>
            <div>回答局面　{getMoveText(answerMoveCount)}</div>
            <div>
              <button onClick={onClickRegisterAnswerMove}>回答局面に登録</button>
            </div>
          </div>
          <div style={{ display: 'flex', margin: '5px' }}>
            <div>問題コメント</div>
            <div style={{ flexGrow: 2 }}>{textFieldQuestionComment}</div>
          </div>
          <div style={{ display: 'flex', margin: '5px' }}>
            <div>回答コメント</div>
            <div style={{ flexGrow: 2 }}>{textFieldAnswerComment}</div>
          </div>
        </div>
      </div>
    </>
  );
  const problem: ShogiProblem = {
    questionComment,
    answerComment,
    startMoveCount: startMoveCount ?? -1,
    questionMoveCount: questionMoveCount ?? -1,
    moves: moves.filter((_, i) => i < (answerMoveCount ?? 0)),
  };
  const setProblem = (problem: ShogiProblem) => {
    const { moves, startMoveCount, questionMoveCount, questionComment, answerComment } = problem;
    setQuestionComment(questionComment);
    setAnswerComment(answerComment);
    setStartMoveCount(startMoveCount);
    setQuestionMoveCount(questionMoveCount);
    setAnswerMoveCount(moves.length);
    setMoves(moves);
  };

  return [ui, problem, setProblem] as const;
};
