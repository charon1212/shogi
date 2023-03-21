import { useState } from 'react';
import {
  createMochigomaTemplateEmpty,
  createMochigomaTemplateFull,
  createMochigomaTemplateHalf,
  createShogiTableTemplateEmpty,
  ShogiBoard,
  ShogiCell,
  ShogiKoma,
  ShogiMasuSD,
} from '@charon1212/shogi-domain';
import { SelectableShogiBoardView } from './SelectableShogiBoardView';

const changeCellOnDoubleClick = (cell: ShogiCell): ShogiCell => {
  if (!cell) return cell;
  else if (cell.koma === 'g' || cell.koma === 'k') return { ...cell, sente: !cell.sente };
  else return { ...cell, nari: !cell.nari, sente: cell.nari ? !cell.sente : cell.sente };
};

export const useEditShogiBoard = () => {
  const [shogiBoard, setShogiBoard] = useState<ShogiBoard>(new ShogiBoard());
  const updateShogiBoard = ({
    board,
    mochigoma,
  }: {
    board: { masu: ShogiMasuSD; cell: ShogiCell }[];
    mochigoma: { sente: boolean; koma: ShogiKoma; delta: number }[];
  }) => {
    const newShogiBoard = shogiBoard.shallowCopy();
    board.forEach(({ masu, cell }) => {
      newShogiBoard.setCell(masu, cell);
    });
    mochigoma.forEach(({ sente, koma, delta }) => {
      newShogiBoard.getMochigoma(sente)[koma] += delta;
    });
    setShogiBoard(newShogiBoard);
  };

  /** ボタン押下時の処理 */
  const onClickBtnInit = () => {
    if (!window.confirm('初期盤面に戻します。よろしいですか？')) return;
    setShogiBoard(new ShogiBoard());
  };
  const onClickBtnMochigoma = () => {
    if (!window.confirm('全ての駒をお互いの持ち駒にします。よろしいですか？')) return;
    const shogiBoardAllMochigoma = new ShogiBoard();
    shogiBoardAllMochigoma.table = createShogiTableTemplateEmpty();
    shogiBoardAllMochigoma.mochigomaSet = { sente: createMochigomaTemplateHalf(), gote: createMochigomaTemplateHalf() };
    setShogiBoard(shogiBoardAllMochigoma);
  };
  const onClickBtnTsume = () => {
    if (!window.confirm('詰将棋用盤面にします。よろしいですか？')) return;
    const shogiBoardTsume = new ShogiBoard();
    shogiBoardTsume.table = createShogiTableTemplateEmpty();
    shogiBoardTsume.mochigomaSet = { sente: createMochigomaTemplateEmpty(), gote: createMochigomaTemplateFull() };
    setShogiBoard(shogiBoardTsume);
  };
  const onClickBtnTeban = () => {
    const newShogiBoard = shogiBoard.shallowCopy();
    newShogiBoard.sente = !newShogiBoard.sente;
    setShogiBoard(newShogiBoard);
  };

  /** UI本体 */
  const ui = (
    <>
      <div style={{ display: 'flex', margin: '10px' }}>
        <button onClick={() => onClickBtnInit()} style={{ margin: '0 5px 0' }}>
          初期盤面
        </button>
        <button onClick={() => onClickBtnMochigoma()} style={{ margin: '0 5px 0' }}>
          全て持ち駒
        </button>
        <button onClick={() => onClickBtnTsume()} style={{ margin: '0 5px 0' }}>
          詰将棋
        </button>
        <button onClick={() => onClickBtnTeban()} style={{ margin: '0 5px 0' }}>
          手番：{shogiBoard.sente ? '先手' : '後手'}
        </button>
      </div>
      <div>
        <SelectableShogiBoardView
          board={shogiBoard}
          allowMochigomaKing
          onClickBoard={({ select, selectMasu, selectMochigoma, clearSelection, clickMasu }) => {
            const clickCell = shogiBoard.getCell(clickMasu);
            if (selectMasu) {
              const selectCell = shogiBoard.getCell(selectMasu);
              if (!selectCell) return clearSelection();
              if (selectMasu.s === clickMasu.s && selectMasu.d === clickMasu.d) {
                // セルのダブルクリック
                updateShogiBoard({ board: [{ masu: selectMasu, cell: changeCellOnDoubleClick(selectCell) }], mochigoma: [] });
                clearSelection();
              } else {
                if (clickCell) {
                  updateShogiBoard({
                    board: [
                      { masu: clickMasu, cell: selectCell }, // 移動後のマスを、移動元の値に
                      { masu: selectMasu, cell: null }, // 移動元のマスを削除
                    ],
                    mochigoma: [{ koma: clickCell.koma, sente: selectCell.sente, delta: +1 }], // 移動後のマスの駒を、選択元側の持ち駒に追加。
                  });
                } else {
                  updateShogiBoard({
                    board: [
                      { masu: clickMasu, cell: selectCell }, // 移動後のマスを、移動元の値に
                      { masu: selectMasu, cell: null }, // 移動元のマスを削除
                    ],
                    mochigoma: [],
                  });
                }
                clearSelection();
              }
            } else if (selectMochigoma) {
              if (!clickCell) {
                updateShogiBoard({
                  board: [{ masu: clickMasu, cell: { ...selectMochigoma, nari: false } }],
                  mochigoma: [{ ...selectMochigoma, delta: -1 }],
                });
              }
              clearSelection();
            } else {
              if (clickCell) select();
            }
          }}
          onClickMochigoma={({ select, selectMasu, selectMochigoma, clearSelection, clickMochigoma: { koma, sente } }) => {
            if (selectMasu) {
              const selectCell = shogiBoard.getCell(selectMasu);
              if (selectCell) {
                updateShogiBoard({
                  board: [{ masu: selectMasu, cell: null }], // 選択マスを空にする
                  mochigoma: [{ koma: selectCell.koma, sente: sente, delta: +1 }], // 持ち駒に+1
                });
              }
              clearSelection();
            } else if (selectMochigoma && selectMochigoma.sente !== sente) {
              updateShogiBoard({
                board: [],
                mochigoma: [
                  { sente: sente, koma: selectMochigoma.koma, delta: +1 }, // クリック側を+1
                  { sente: !sente, koma: selectMochigoma.koma, delta: -1 }, // クリック側と逆側を-1
                ],
              });
              clearSelection();
            } else {
              if (shogiBoard.getMochigoma(sente)[koma] > 0) select();
            }
          }}
          onRightClickBoard={({ clearSelection }) => clearSelection()}
          onRightClickMochigoma={({ clearSelection }) => clearSelection()}
        />
      </div>
    </>
  );
  return [ui, shogiBoard, setShogiBoard] as const;
};
