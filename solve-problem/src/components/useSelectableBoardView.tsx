import { useState } from 'react';
import { ShogiBoard, ShogiKoma } from '../domain/shogi';
import { ShogiMasu } from '../domain/shogiZahyo';
import { ShogiBoardView } from './ShogiBoardView';

const selectColor = 'yellow';
export const useSelectableBoardView = ({
  board,
  onClickMasu,
}: {
  board: ShogiBoard;
  onClickMasu: (args: { clearSelection: () => void; clickMasu: ShogiMasu; selectMasu?: ShogiMasu; selectMochigoma?: ShogiKoma }) => unknown;
}) => {
  const [selectMasu, setSelectMasu] = useState<ShogiMasu | undefined>(undefined);
  const [selectMochigoma, setSelectMochigoma] = useState<ShogiKoma | undefined>(undefined);

  const clearSelection = () => {
    setSelectMochigoma(undefined);
    setSelectMasu(undefined);
  };
  const ui = (
    <ShogiBoardView
      board={board}
      colorize={selectMasu ? [{ masu: selectMasu, color: selectColor }] : []}
      colorMochigoma={selectMochigoma ? [{ koma: selectMochigoma, sente: board.sente, color: selectColor }] : []}
      onClickBoard={(masu) => {
        const cell = board.board[masu.s - 1][masu.d - 1];
        if (cell?.sente === board.sente) {
          setSelectMasu(masu);
          setSelectMochigoma(undefined);
        } else {
          onClickMasu({ clearSelection, clickMasu: masu, selectMasu, selectMochigoma });
        }
      }}
      onClickMochigoma={(koma, sente) => {
        if (sente === board.sente) {
          setSelectMochigoma(koma);
          setSelectMasu(undefined);
        } else {
          clearSelection();
        }
      }}
    />
  );

  return [ui] as const;
};
