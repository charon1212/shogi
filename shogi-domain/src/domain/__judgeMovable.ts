import { ShogiBoard } from "./ShogiBoard";
import { ShogiKoma } from "./ShogiKoma";
import { ShogiMove } from "./ShogiMove";

export const ShogiBoard_judgeMovable = (shogiBoard: ShogiBoard, move: ShogiMove): string => {

  const { after, sente, uchi } = move;
  const afterCell = shogiBoard.getCell(after);

  if (shogiBoard.sente !== sente) return '2手指し';

  // 打ちの場合
  if (uchi) {
    const { koma } = move;
    if (shogiBoard.getMochigoma(sente)[koma] <= 0) return '持っていない持ち駒の打ち';
    if (shogiBoard.getCell(after)) return '駒の存在する場所への打ち';
    if (koma === 'p' && existPawn(shogiBoard, after.s, sente)) return '2歩';
    if (!canMoreMove(sente, after.d, koma, false)) return 'これ以上進めないところへの打ち';
  }

  // 盤上の移動の場合
  if (!uchi) {
    const { before, nari } = move;
    const beforeCell = shogiBoard.getCell(before);
    if (!beforeCell) return '移動元に駒がない';
    if (afterCell && afterCell.sente === beforeCell.sente) return '移動先に自分の駒がある';
    if (!shogiBoard.getKomaDominance(before).some((m) => m.d === after.d && m.s === after.s)) return '駒の利きの範囲外への移動';
    if (nari) { // 成りの場合
      if (beforeCell.nari) return '成り駒の再度成り';
      if (beforeCell.koma === 'g' || beforeCell.koma === 'k') return '成れない駒の成り';
      if (sente && before.d > 3 && after.d > 3) return '成れない移動の成り';
      if (!sente && before.d < 7 && after.d < 7) return '成れない移動の成り';
    } else { // 成らずの場合
      if (!canMoreMove(sente, after.d, beforeCell.koma, beforeCell.nari)) return 'これ以上進めないところへの移動';
    }
  }

  return '';
};

const arr9 = [...Array(9)].map((_, i) => i + 1);
const existPawn = (shogiBoard: ShogiBoard, s: number, sente: boolean) => arr9.some((d) => {
  const cell = shogiBoard.getCell({ s, d });
  return cell?.koma === 'p' && cell?.sente === sente;
});

/** これ以上進めるか判定する。 */
const canMoreMove = (sente: boolean, d: number, koma: ShogiKoma, nari: boolean): boolean => {
  if (nari) return true;
  if (koma === 'p' || koma === 'l') {
    if (sente && d === 1) return false;
    if (!sente && d === 9) return false;
  }
  if (koma === 'n') {
    if (sente && d <= 2) return false;
    if (!sente && d >= 8) return false;
  }
  return true;
};
