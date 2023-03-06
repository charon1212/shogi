import { useState } from 'react';
import { ShogiBoard, ShogiCell, ShogiKoma } from '../domain/shogi';
import { createShogiBoardAllMochigoma, createShogiBoardInit, createShogiBoardTsume } from '../domain/shogiBoardTemplate';
import { ShogiMasu } from '../domain/shogiZahyo';
import { deepCopy } from '../util/deepCopy';
import { SelectableShogiBoardView } from './SelectableShogiBoardView';

const shogiBoardInit = createShogiBoardInit();
const shogiBoardAllMochigoma: ShogiBoard = createShogiBoardAllMochigoma();
const shogiBoardTsume: ShogiBoard = createShogiBoardTsume();

const changeCellOnDoubleClick = (cell: ShogiCell): ShogiCell => {
  if (!cell) return cell;
  else if (cell.koma === 'g' || cell.koma === 'k') return { ...cell, sente: !cell.sente };
  else return { ...cell, nari: !cell.nari, sente: cell.nari ? !cell.sente : cell.sente };
};

export const useEditShogiBoard = () => {
  const [shogiBoard, setShogiBoard] = useState<ShogiBoard>(deepCopy(shogiBoardInit));
  const { sente, mochigoma, board } = shogiBoard;
  const updateShogiBoard = ({
    board,
    mochigoma,
  }: {
    board: { masu: ShogiMasu; cell: ShogiCell }[];
    mochigoma: { sente: boolean; koma: ShogiKoma; delta: number }[];
  }) => {
    const newShogiBoard = deepCopy(shogiBoard);
    board.forEach(({ masu, cell }) => {
      newShogiBoard.board[masu.s - 1][masu.d - 1] = cell;
    });
    mochigoma.forEach(({ sente, koma, delta }) => {
      if (sente) newShogiBoard.mochigoma.sente[koma] += delta;
      if (!sente) newShogiBoard.mochigoma.gote[koma] += delta;
    });
    if (sente !== undefined) newShogiBoard.sente = sente;
    setShogiBoard(newShogiBoard);
  };

  /** ボタン押下時の処理 */
  const onClickBtnInit = () => {
    if (!window.confirm('初期盤面に戻します。よろしいですか？')) return;
    setShogiBoard(deepCopy(shogiBoardInit));
  };
  const onClickBtnMochigoma = () => {
    if (!window.confirm('全ての駒をお互いの持ち駒にします。よろしいですか？')) return;
    setShogiBoard(deepCopy(shogiBoardAllMochigoma));
  };
  const onClickBtnTsume = () => {
    if (!window.confirm('詰将棋用盤面にします。よろしいですか？')) return;
    setShogiBoard(deepCopy(shogiBoardTsume));
  };
  const onClickBtnTeban = () => setShogiBoard({ ...shogiBoard, sente: !sente });

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
          手番：{sente ? '先手' : '後手'}
        </button>
      </div>
      <div>
        <SelectableShogiBoardView
          board={shogiBoard}
          allowMochigomaKing
          onClickBoard={({ select, selectMasu, selectMochigoma, clearSelection, clickMasu }) => {
            const clickCell = board[clickMasu.s - 1][clickMasu.d - 1];
            if (selectMasu) {
              const selectCell = board[selectMasu.s - 1][selectMasu.d - 1];
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
              if (board[clickMasu.s - 1][clickMasu.d - 1]) select();
            }
          }}
          onClickMochigoma={({ select, selectMasu, selectMochigoma, clearSelection, clickMochigoma: { koma, sente } }) => {
            if (selectMasu) {
              const cell = board[selectMasu.s - 1][selectMasu.d - 1];
              if (cell) {
                updateShogiBoard({
                  board: [{ masu: selectMasu, cell: null }], // 選択マスを空にする
                  mochigoma: [{ koma: cell.koma, sente: sente, delta: +1 }], // 持ち駒に+1
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
              if ((sente && mochigoma.sente[koma] > 0) || (!sente && mochigoma.gote[koma] > 0)) select();
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
