import { useState } from 'react';
import { adaptShogiMove } from '../domain/adaptShogiMove';
import { ShogiBoard, ShogiMove } from '../domain/shogi';
import { MoveInputShogiBoardView } from './MoveInputShogiBoardView';
import { useMoveListView } from './useMoveListView';

type UseEditShogiSingleKifuArgs = {
  initShogiBoard: ShogiBoard;
};
export const useEditShogiSingleKifu = ({ initShogiBoard }: UseEditShogiSingleKifuArgs) => {
  const [startBoard, setStartBoard] = useState<ShogiBoard>(initShogiBoard);

  // const [moveCount, setMoveCount] = useState(0); // 0は開始局面
  const [moves, setMoves] = useState<ShogiMove[]>([]);
  const [uiMoveListView, moveCount, setMoveCount] = useMoveListView({ moveList: moves });
  const board = moves.filter((_, i) => i < moveCount).reduce((prevBoard, move) => adaptShogiMove(prevBoard, move, true), startBoard);

  const lastMove = moveCount === 0 ? undefined : moves[moveCount - 1];

  const uiEditShogiSingleKifu = (
    <div style={{ display: 'flex' }}>
      <div>
        <MoveInputShogiBoardView
          board={board}
          onInputMove={(move) => {
            const newMoves = [...moves.filter((_, i) => i < moveCount), move];
            setMoveCount(newMoves.length);
            setMoves(newMoves);
          }}
          colorBoard={lastMove ? [{ masu: lastMove.after, color: 'lightcoral' }] : []}
        />
      </div>
      <div style={{ height: '290px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>{uiMoveListView}</div>
    </div>
  );

  return { uiEditShogiSingleKifu, startBoard, setStartBoard, moves, setMoves, moveCount, board };
};
