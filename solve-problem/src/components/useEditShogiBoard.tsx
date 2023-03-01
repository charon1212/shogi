import { useState } from 'react';
import { createInitBoard } from '../domain/createInitBoard';
import { ShogiBoard, ShogiCell, ShogiKoma } from '../domain/shogi';
import { ShogiMasu } from '../domain/shogiZahyo';
import { deepCopy } from '../util/deepCopy';
import { ShogiBoardView } from './ShogiBoardView';

const color = 'yellow';
const init = createInitBoard();
const arr9 = [...Array(9)];

export const useEditShogiBoard = () => {
  /** 手番 */
  const [sente, setSente] = useState(true);

  /** 持ち駒 */
  const [mochigomaSente, setMochigomaSente] = useState(init.mochigoma.sente);
  const [mochigomaGote, setMochigomaGote] = useState(init.mochigoma.gote);
  const mochigomaCountUp = (koma: ShogiKoma, sente: boolean, delta: number) => {
    if (sente) setMochigomaSente({ ...mochigomaSente, [koma]: mochigomaSente[koma] + delta });
    else setMochigomaGote({ ...mochigomaGote, [koma]: mochigomaGote[koma] + delta });
  };

  /** 盤面 */
  const [board, setBoard] = useState<ShogiCell[][]>(init.board);
  const updateBoard = (updateSet: { masu: ShogiMasu; cell: ShogiCell }[]) => {
    const newBoard = deepCopy(board);
    updateSet.forEach(({ masu, cell }) => (newBoard[masu.s - 1][masu.d - 1] = cell));
    setBoard(newBoard);
  };

  /** 選択 */
  const [selectMasu, setSelectMasu] = useState<ShogiMasu | undefined>(undefined);
  const [selectMochigoma, setSelectMochigoma] = useState<{ sente: boolean; koma: ShogiKoma } | undefined>(undefined);
  const clearSelection = () => {
    setSelectMasu(undefined);
    setSelectMochigoma(undefined);
  };

  /** 状態から決定される盤面情報 */
  const shogiBoard: ShogiBoard = {
    sente,
    mochigoma: { sente: mochigomaSente, gote: mochigomaGote },
    board,
  };

  /** ボタン押下時の処理 */
  const onClickBtnInit = () => {
    const conf = window.confirm('初期盤面に戻します。よろしいですか？');
    if (!conf) return;
    setSente(true);
    setMochigomaSente(init.mochigoma.sente);
    setMochigomaGote(init.mochigoma.gote);
    setBoard(init.board);
    clearSelection();
  };
  const onClickBtnMochigoma = () => {
    const conf = window.confirm('全ての駒をお互いの持ち駒にします。よろしいですか？');
    if (!conf) return;
    setSente(true);
    setMochigomaSente({ p: 9, l: 2, n: 2, s: 2, g: 2, r: 1, b: 1, k: 1 });
    setMochigomaGote({ p: 9, l: 2, n: 2, s: 2, g: 2, r: 1, b: 1, k: 1 });
    setBoard(arr9.map(() => arr9.map(() => null)));
    clearSelection();
  };
  const onClickBtnTsume = () => {
    const conf = window.confirm('詰将棋用盤面にします。よろしいですか？');
    if (!conf) return;
    setSente(true);
    setMochigomaSente({ p: 0, l: 0, n: 0, s: 0, g: 0, r: 0, b: 0, k: 0 });
    setMochigomaGote({ p: 18, l: 4, n: 4, s: 4, g: 4, r: 2, b: 2, k: 2 });
    setBoard(arr9.map(() => arr9.map(() => null)));
    clearSelection();
  };
  const onClickBtnTeban = () => setSente(!sente);

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
        <button onClick={() => clearSelection()} style={{ margin: '0 5px 0' }}>
          選択解除
        </button>
        <button onClick={() => onClickBtnTeban()} style={{ margin: '0 5px 0' }}>
          手番：{sente ? '先手' : '後手'}
        </button>
      </div>
      <div>
        <ShogiBoardView
          board={shogiBoard}
          allowMochigomaKing
          colorBoard={selectMasu ? [{ masu: selectMasu, color }] : []}
          colorMochigoma={selectMochigoma ? [{ ...selectMochigoma, color }] : []}
          onClickBoard={(masu) => {
            if (selectMasu) {
              if (selectMasu.s === masu.s && selectMasu.d === masu.d) {
                // マスのダブルクリック
                const cell = board[masu.s - 1][masu.d - 1];
                if (cell) {
                  if (cell.koma === 'g' || cell.koma === 'k') {
                    // GOLD=金とKING=玉は成りがないので、先後の入れ替えのみ。
                    updateBoard([{ masu, cell: { ...cell, sente: !cell.sente } }]);
                  } else {
                    updateBoard([{ masu, cell: { ...cell, nari: !cell.nari, sente: cell.nari ? !cell.sente : cell.sente } }]);
                  }
                }
                clearSelection();
              } else {
                const beforeCell = board[selectMasu.s - 1][selectMasu.d - 1];
                if (!beforeCell) return;
                const afterCell = board[masu.s - 1][masu.d - 1];
                if (afterCell && afterCell.sente === beforeCell.sente) {
                } else if (afterCell && afterCell.sente !== beforeCell.sente) {
                  // 両方のセルの駒の持ち主が異なる場合は、「移動後の場所の駒」を「移動元の場所の駒の持ち主の持ち駒」にしてから、移動する。
                  mochigomaCountUp(afterCell.koma, beforeCell.sente, +1);
                  updateBoard([
                    { masu, cell: board[selectMasu.s - 1][selectMasu.d - 1] }, // 移動後のマスを変更
                    { masu: selectMasu, cell: null }, // 移動元のマスを削除
                  ]);
                } else {
                  updateBoard([
                    { masu, cell: board[selectMasu.s - 1][selectMasu.d - 1] }, // 移動後のマスを変更
                    { masu: selectMasu, cell: null }, // 移動元のマスを削除
                  ]);
                }
                clearSelection();
              }
            } else if (selectMochigoma) {
              if (!board[masu.s - 1][masu.d - 1]) {
                mochigomaCountUp(selectMochigoma.koma, selectMochigoma.sente, -1);
                updateBoard([{ masu, cell: { ...selectMochigoma, nari: false } }]);
              }
              clearSelection();
            } else {
              if (board[masu.s - 1][masu.d - 1]) {
                setSelectMasu(masu);
              }
            }
          }}
          onClickMochigoma={(koma, sente) => {
            if (selectMasu) {
              const cell = board[selectMasu.s - 1][selectMasu.d - 1];
              if (cell) {
                mochigomaCountUp(cell.koma, sente, +1);
                updateBoard([{ masu: selectMasu, cell: null }]);
              }
              clearSelection();
            } else if (selectMochigoma && selectMochigoma.koma === koma && selectMochigoma.sente === sente) {
              // 持ち駒のダブルクリック
              if ((sente && mochigomaSente[koma] > 0) || (!sente && mochigomaGote[koma] > 0)) {
                mochigomaCountUp(koma, sente, -1);
                mochigomaCountUp(koma, !sente, +1);
              }
              clearSelection();
            } else {
              if ((sente && mochigomaSente[koma] > 0) || (!sente && mochigomaGote[koma] > 0)) {
                setSelectMochigoma({ sente, koma });
                setSelectMasu(undefined);
              }
            }
          }}
        />
      </div>
    </>
  );
  return [ui, shogiBoard] as const;
};
