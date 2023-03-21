import { useEffect, useState } from 'react';
import { ShogiBoard, ShogiKoma, ShogiMasuSD } from '@charon1212/shogi-domain';
import { ShogiBoardView } from './ShogiBoardView';

const selectColor = 'yellow';
type SelectMasu = ShogiMasuSD | undefined;
type SelectMochigoma = { sente: boolean; koma: ShogiKoma } | undefined;
type CommonOnClickArgs = { select: () => void; clearSelection: () => void; selectMasu: SelectMasu; selectMochigoma: SelectMochigoma };
type Props = {
  board: ShogiBoard;
  colorBoard?: { masu: ShogiMasuSD; color: string }[];
  colorMochigoma?: { sente: boolean; koma: ShogiKoma; color: string }[];
  onClickBoard?: (args: CommonOnClickArgs & { clickMasu: ShogiMasuSD }) => unknown;
  onClickMochigoma?: (args: CommonOnClickArgs & { clickMochigoma: { sente: boolean; koma: ShogiKoma } }) => unknown;
  onRightClickBoard?: (args: CommonOnClickArgs & { clickMasu: ShogiMasuSD }) => unknown;
  onRightClickMochigoma?: (args: CommonOnClickArgs & { clickMochigoma: { sente: boolean; koma: ShogiKoma } }) => unknown;
  allowMochigomaKing?: boolean;
};
export const SelectableShogiBoardView = (props: Props) => {
  const { board, colorBoard, colorMochigoma, onClickBoard, onClickMochigoma, onRightClickBoard, onRightClickMochigoma, allowMochigomaKing } = props;
  const [selectMasu, setSelectMasu] = useState<SelectMasu>(undefined);
  const [selectMochigoma, setSelectMochigoma] = useState<SelectMochigoma>(undefined);

  const selectColorBoard = selectMasu ? [{ masu: selectMasu, color: selectColor }] : [];
  const selectColorMochigoma = selectMochigoma ? [{ ...selectMochigoma, color: selectColor }] : [];
  const clearSelection = () => {
    setSelectMochigoma(undefined);
    setSelectMasu(undefined);
  };
  const sMasu = (masu: ShogiMasuSD) => () => {
    setSelectMochigoma(undefined);
    setSelectMasu(masu);
  };
  const sMochigoma = (mochigoma: { sente: boolean; koma: ShogiKoma }) => () => {
    setSelectMochigoma(mochigoma);
    setSelectMasu(undefined);
  };

  useEffect(() => {
    clearSelection();
  }, [board]);

  return (
    <ShogiBoardView
      board={board}
      colorBoard={[...selectColorBoard, ...(colorBoard ?? [])]}
      colorMochigoma={[...selectColorMochigoma, ...(colorMochigoma ?? [])]}
      onClickBoard={(masu) => onClickBoard?.({ clearSelection, selectMasu, selectMochigoma, select: sMasu(masu), clickMasu: masu })}
      onClickMochigoma={(koma, sente) =>
        onClickMochigoma?.({ clearSelection, selectMasu, selectMochigoma, select: sMochigoma({ koma, sente }), clickMochigoma: { koma, sente } })
      }
      onRightClickBoard={(masu) => onRightClickBoard?.({ clearSelection, selectMasu, selectMochigoma, select: sMasu(masu), clickMasu: masu })}
      onRightClickMochigoma={(koma, sente) =>
        onRightClickMochigoma?.({ clearSelection, selectMasu, selectMochigoma, select: sMochigoma({ koma, sente }), clickMochigoma: { koma, sente } })
      }
    />
  );
};
