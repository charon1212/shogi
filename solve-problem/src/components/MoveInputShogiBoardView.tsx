import { createShogiMove, setShogiMoveText } from '../domain/createShogiMove';
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
          const moveNarazu = createShogiMove({ before: selectMasu, after: clickMasu, board, nari: false });
          const movableNarazu = judgeMovable(board, moveNarazu);
          const moveNari: ShogiMove = createShogiMove({ before: selectMasu, after: clickMasu, board, nari: true });
          const movableNari = judgeMovable(board, moveNari);
          if (!movableNarazu.movable && !movableNari.movable) alert(`エラー：${movableNarazu.msg}`);
          else {
            const move = !movableNari.movable
              ? moveNarazu
              : !movableNarazu.movable
              ? moveNari
              : window.confirm('成りますか？')
              ? moveNari
              : moveNarazu;
            setShogiMoveText(board, move);
            onInputMove?.(move);
          }
          clearSelection();
        } else if (selectMochigoma && selectMochigoma.sente === board.sente) {
          const move: ShogiMove = createShogiMove({ after: clickMasu, board, uchi: selectMochigoma.koma });
          if (judgeMovable(board, move).movable) {
            setShogiMoveText(board, move);
            onInputMove?.(move);
          }
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
