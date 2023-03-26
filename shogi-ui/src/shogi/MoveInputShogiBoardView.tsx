import { ShogiBoard, ShogiKoma, ShogiMove, ShogiMasuSD } from '@charon1212/shogi-domain';
import { SelectableShogiBoardView } from './SelectableShogiBoardView';

type Props = {
  shogiBoard: ShogiBoard;
  onInputMove?: (move: ShogiMove) => unknown;
  colorBoard?: { masu: ShogiMasuSD; color: string }[];
  colorMochigoma?: { sente: boolean; koma: ShogiKoma; color: string }[];
  allowMochigomaKing?: boolean;
};
export const MoveInputShogiBoardView = (props: Props) => {
  const { shogiBoard, onInputMove, colorBoard, colorMochigoma, allowMochigomaKing } = props;
  return (
    <SelectableShogiBoardView
      board={shogiBoard}
      colorBoard={colorBoard}
      colorMochigoma={colorMochigoma}
      allowMochigomaKing={allowMochigomaKing}
      onClickBoard={({ select, clickMasu, selectMasu, selectMochigoma, clearSelection }) => {
        const clickCell = shogiBoard.getCell(clickMasu);
        if (selectMasu) {
          const selectCell = shogiBoard.getCell(selectMasu);
          if (!selectCell) throw new Error('選択マスに駒がない'); // エラーケース
          const moveNarazu: ShogiMove = {
            uchi: false,
            before: selectMasu,
            after: clickMasu,
            koma: selectCell.koma,
            narikoma: selectCell.nari,
            nari: false,
            sente: shogiBoard.sente,
          };
          const moveNari: ShogiMove = {
            uchi: false,
            before: selectMasu,
            after: clickMasu,
            koma: selectCell.koma,
            narikoma: selectCell.nari,
            nari: true,
            sente: shogiBoard.sente,
          };
          const errMovableNarazu = shogiBoard.judgeMovable(moveNarazu);
          const errMovableNari = shogiBoard.judgeMovable(moveNari);
          if (errMovableNarazu && errMovableNari) alert(`エラー：${errMovableNarazu}`);
          else {
            const move = errMovableNari ? moveNarazu : errMovableNarazu ? moveNari : window.confirm('成りますか？') ? moveNari : moveNarazu;
            onInputMove?.(move);
          }
          clearSelection();
        } else if (selectMochigoma && selectMochigoma.sente === shogiBoard.sente) {
          const move: ShogiMove = { uchi: true, after: clickMasu, koma: selectMochigoma.koma, sente: shogiBoard.sente };
          if (!shogiBoard.judgeMovable(move)) {
            onInputMove?.(move);
          }
        } else {
          if (clickCell?.sente === shogiBoard.sente) select();
        }
      }}
      onClickMochigoma={({ select, clickMochigoma }) => {
        if (clickMochigoma.sente === shogiBoard.sente) select();
      }}
      onRightClickBoard={({ clearSelection }) => clearSelection()}
      onRightClickMochigoma={({ clearSelection }) => clearSelection()}
    />
  );
};
