import { judgeMovable } from '../domain/judgeMovable';
import { ShogiBoard, ShogiKoma, ShogiMove } from '../domain/shogi';
import { ShogiMasu } from '../domain/shogiZahyo';
import { SelectableShogiBoardView } from './SelectableShogiBoardView';

type Props = {
  board: ShogiBoard;
  onInputMove?: (move: ShogiMove) => unknown;
  colorBoard?: { masu: ShogiMasu; color: string }[];
  colorMochigoma?: { sente: boolean; koma: ShogiKoma; color: string }[];
  allowMochigomaKing?: boolean;
};
export const MoveInputShogiBoardView = (props: Props) => {
  const { board, onInputMove, colorBoard, colorMochigoma, allowMochigomaKing } = props;
  return (
    <SelectableShogiBoardView
      board={board}
      colorBoard={colorBoard}
      colorMochigoma={colorMochigoma}
      allowMochigomaKing={allowMochigomaKing}
      onClickBoard={({ select, clickMasu, selectMasu, selectMochigoma, clearSelection }) => {
        if (selectMasu) {
          const moveNarazu: ShogiMove = { before: selectMasu, after: clickMasu, sente: board.sente, nari: false };
          const movableNarazu = judgeMovable(board, moveNarazu);
          const moveNari: ShogiMove = { before: selectMasu, after: clickMasu, sente: board.sente, nari: true };
          const movableNari = judgeMovable(board, moveNari);
          if (movableNarazu.movable && movableNari.movable) onInputMove?.(window.confirm('成りますか？') ? moveNari : moveNarazu);
          if (movableNarazu.movable && !movableNari.movable) onInputMove?.(moveNarazu);
          if (!movableNarazu.movable && movableNari.movable) onInputMove?.(moveNari);
          if (!movableNarazu.movable && !movableNari.movable) alert(`エラー：${movableNarazu.msg}`);
          clearSelection();
        } else if (selectMochigoma && selectMochigoma.sente === board.sente) {
          const move: ShogiMove = { before: { d: 0, s: 0 }, after: clickMasu, sente: board.sente, nari: false, uchi: selectMochigoma.koma };
          if (judgeMovable(board, move).movable) onInputMove?.(move);
        } else {
          const cell = board.board[clickMasu.s - 1][clickMasu.d - 1];
          if (cell?.sente === board.sente) select();
        }
      }}
      onClickMochigoma={({ select, clickMochigoma }) => {
        if (clickMochigoma.sente === board.sente) select();
      }}
      onRightClickBoard={({ clearSelection }) => clearSelection()}
      onRightClickMochigoma={({ clearSelection }) => clearSelection()}
    />
  );
};
