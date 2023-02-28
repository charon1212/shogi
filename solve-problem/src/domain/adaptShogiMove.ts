import { deepCopy } from "../util/deepCopy";
import { ShogiBoard, ShogiMove } from "./shogi";

/**
 * 指定した盤面から、指定した駒の移動を行う。
 * 移動の正当性確認はしない。
 *
 * @param shogiBoard 移動前の盤面
 * @param move 移動内容
 * @param copy 盤面のdeepcopyを取得する場合はtrueを指定する。
 * @returns 移動後の盤面。copyにtrueを指定した場合は新しいオブジェクトを、そうでない場合はshogiBoardで指定したオブジェクトを直接更新して返却する。
 */
export const adaptShogiMove = (shogiBoard: ShogiBoard, move: ShogiMove, copy?: boolean): ShogiBoard => {
  const board2 = copy ? deepCopy(shogiBoard) : shogiBoard;
  const { before, after, nari, uchi, sente } = move;
  if (uchi) {
    board2.board[after.s - 1][after.d - 1] = { koma: uchi, nari: false, sente }; // 移動先の入れ替え
    if (sente) board2.mochigoma.sente[uchi] -= 1; // 持ち駒の削除
    if (!sente) board2.mochigoma.gote[uchi] -= 1;
  } else {
    const afterCell = shogiBoard.board[after.s - 1][after.d - 1];
    if (afterCell) { // 持ち駒の回収
      if (sente) board2.mochigoma.sente[afterCell.koma] += 1;
      if (!sente) board2.mochigoma.gote[afterCell.koma] += 1;
    }
    board2.board[after.s - 1][after.d - 1] = board2.board[before.s - 1][before.d - 1]; // 移動先の入れ替え。
    board2.board[before.s - 1][before.d - 1] = null; // 移動元の削除
  }
  board2.sente = !sente;
  return board2;
};
