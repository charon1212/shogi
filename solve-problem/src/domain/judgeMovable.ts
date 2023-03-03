import { ShogiBoard, ShogiKoma, ShogiMove } from "./shogi";
import { ShogiMasu } from "./shogiZahyo";

export type JudgeMovableResult = { movable: true, msg: '' } | { movable: false, msg: string };

/**
 * ある盤面に対して、その移動が可能であるかどうかを判定する。判定内容は以下のとおり。
 * なお、王手に関する禁じ手（王手放置、自ら王手、連続王手の千日手）は範囲外とする。
 *
 * - 一般
 *   - 2手指し
 * - 打ちの場合
 *   - 打ちながら成ることの禁止
 *   - 持っていない持ち駒の打ち
 *   - 2歩
 * - 盤上の移動の場合
 *   - 移動元に駒がない
 *   - 移動先に自分の駒がある
 *   - 駒の移動範囲外への移動
 *   - 移動の中間に合駒がある
 * - 成りの場合
 *   - 成り駒の再度成り
 *   - 成れない駒の成り
 *   - 成れない移動の成り
 * - 成らずの場合
 *   - これ以上進めないところへの移動
 *
 * @param shogiBoard 盤面
 * @param move 移動
 * @returns 判定結果。不可の場合、その理由をmsgプロパティに文字列で返却する。
 */
export const judgeMovable = (shogiBoard: ShogiBoard, move: ShogiMove,): JudgeMovableResult => {
  const ng = (msg: string): { movable: false, msg: string } => ({ movable: false, msg });

  const { before, after, nari, uchi, sente } = move;
  const mochigoma = sente ? shogiBoard.mochigoma.sente : shogiBoard.mochigoma.gote;
  const afterCell = shogiBoard.board[after.s - 1][after.d - 1];

  // 一般
  if (shogiBoard.sente !== move.sente) return ng('2手指し');

  // 打ちの場合
  if (uchi) {
    if (nari) return ng('打ちながら成ることの禁止');
    if (mochigoma[uchi] <= 0) return ng('持っていない持ち駒の打ち');
    if (uchi === 'p' && existPawn(shogiBoard, after.s, sente)) return ng('2歩');
  }

  // 盤上の移動の場合
  if (!uchi) {
    const beforeCell = shogiBoard.board[before.s - 1][before.d - 1];
    if (!beforeCell) return ng('移動元に駒がない');
    if (afterCell && afterCell.sente === beforeCell.sente) return ng('移動先に自分の駒がある');
    const moveSort = getMoveSort(beforeCell.koma, beforeCell.nari);
    const moveSortKeyValue = getMoveSortKeyValue(before, after, beforeCell.sente);
    if (!moveSortKeyValue) return ng('駒の移動範囲外への移動'); // そもそも移動ができない。（before = afterや、横に2マス、縦に3マスの移動など）
    if (moveSort[moveSortKeyValue.key] < moveSortKeyValue.value) return ng('駒の移動範囲外への移動'); // 駒の移動的にその移動ができない。
    if (moveSortKeyValue.value === 2 && existAigoma(shogiBoard, before, after)) return ng('移動の中間に合駒がある');
  }

  const beforeCellKoma: ShogiKoma = uchi || shogiBoard.board[before.s - 1][before.d - 1]?.koma!;
  const beforeCellNari: boolean = uchi ? false : shogiBoard.board[before.s - 1][before.d - 1]?.nari!;

  // 成りの場合
  if (nari) {
    if (beforeCellNari) return ng('成り駒の再度成り');
    if (beforeCellKoma === 'g' || beforeCellKoma === 'k') return ng('成れない駒の成り');
    if (sente && (before.d > 3 && after.d > 3)) return ng('成れない移動の成り');
    if (!sente && (before.d < 7 && after.d < 7)) return ng('成れない移動の成り');
  }

  // 成らずの場合
  if (!nari) {
    if (!beforeCellNari && (beforeCellKoma === 'p' || beforeCellKoma === 'l')) {
      if (sente && after.d === 1) return ng('これ以上進めないところへの移動');
      if (!sente && after.d === 9) return ng('これ以上進めないところへの移動');
    } else if (!beforeCellNari && (beforeCellKoma === 'n')) {
      if (sente && (after.d === 1 || after.d === 2)) return ng('これ以上進めないところへの移動');
      if (!sente && (after.d === 9 || after.d === 8)) return ng('これ以上進めないところへの移動');
    }
  }

  return { movable: true, msg: '' };
};

/** - - - - 2歩判定 - - - - */
const arr9 = [...Array(9)];
const existPawn = (shogiBoard: ShogiBoard, suji: number, sente: boolean) => arr9.map((_, i) => i).some((d) => {
  const c = shogiBoard.board[suji - 1][d];
  return c && c.sente === sente && c.koma === 'p' && !c.nari;
});

/** - - - - 合駒判定 - - - - */
const unit = (a: number) => a === 0 ? 0 : a / Math.abs(a);
const between = (start: number, last: number) => start < last ? ((value: number) => start < value && value < last) : ((value: number) => last < value && value < start);
const existAigoma = (shogiBoard: ShogiBoard, before: ShogiMasu, after: ShogiMasu): boolean => {
  const dd = unit(after.d - before.d);
  const ds = unit(after.s - before.s);
  if (dd === 0 && ds === 0) return false;
  const betweenD = between(before.d, after.d);
  const betweenS = between(before.s, after.s);
  let current = { ...before };
  current.d += dd;
  current.s += ds
  while (betweenD(current.d) && betweenS(current.s)) {
    current.d += dd;
    current.s += ds;
    if (shogiBoard.board[current.s - 1][current.d - 1]) return true;
  }
  return false;
};

/** - - - - 駒の移動に関する判定 - - - - */
type MoveSortValue = 0 | 1 | 2;
type MoveSort = {
  front: MoveSortValue, // 前移動
  back: MoveSortValue, // 後移動
  side: MoveSortValue, // 横移動
  frontSide: MoveSortValue, // 前横移動
  backSide: MoveSortValue, // 後横移動
  night: MoveSortValue, // 桂馬移動
};

const getMoveSortKeyValue = (before: ShogiMasu, after: ShogiMasu, sente: boolean): { key: keyof MoveSort, value: MoveSortValue } | null => {
  const diffD = sente ? before.d - after.d : after.d - before.d; // 縦の移動量。正負の値。前（歩の進む向き）だと正の値。
  const diffS = Math.abs(before.s - after.s); // 横の移動量。非負の値のみ。
  if (diffS === 0 && diffD === 0) return null;
  if (diffS === 0 && diffD === 1) return { key: 'front', value: 1 };
  if (diffS === 0 && diffD === -1) return { key: 'back', value: 1 };
  if (diffS === 0 && diffD > 0) return { key: 'front', value: 2 };
  if (diffS === 0 && diffD < 0) return { key: 'back', value: 2 };
  if (diffS === 1 && diffD === 0) return { key: 'side', value: 1 };
  if (diffS === 1 && diffD === 1) return { key: 'frontSide', value: 1 };
  if (diffS === 1 && diffD === 2) return { key: 'night', value: 1 };
  if (diffS === 1 && diffD === -1) return { key: 'backSide', value: 1 };
  if (diffS === 1) return null;
  // この時点で、diffS >= 2。後は飛車の横移動と角の移動を検知する。
  if (diffD === 0) return { key: 'side', value: 2 };
  if (diffS === diffD) return { key: 'frontSide', value: 2 };
  if (diffS === -diffD) return { key: 'backSide', value: 2 };
  return null;
};

const getMoveSort = (koma: ShogiKoma, nari: boolean): MoveSort => {
  if (koma === 'p' && !nari)
    return { front: 1, back: 0, side: 0, frontSide: 0, backSide: 0, night: 0, }; // 歩
  if (koma === 'l' && !nari)
    return { front: 2, back: 0, side: 0, frontSide: 0, backSide: 0, night: 0, }; // 香
  if (koma === 'n' && !nari)
    return { front: 0, back: 0, side: 0, frontSide: 0, backSide: 0, night: 1, }; // 桂
  if (koma === 's' && !nari)
    return { front: 1, back: 0, side: 0, frontSide: 1, backSide: 1, night: 0, }; // 銀
  if (koma === 'g' || (nari && (koma === 'p' || koma === 'l' || koma === 'n' || koma === 's')))
    return { front: 1, back: 1, side: 1, frontSide: 1, backSide: 0, night: 0, }; // 金・成金
  if (koma === 'b' && !nari)
    return { front: 0, back: 0, side: 0, frontSide: 2, backSide: 2, night: 0, }; // 角
  if (koma === 'b' && nari)
    return { front: 1, back: 1, side: 1, frontSide: 2, backSide: 2, night: 0, }; // 馬
  if (koma === 'r' && !nari)
    return { front: 2, back: 2, side: 2, frontSide: 0, backSide: 0, night: 0, }; // 飛
  if (koma === 'r' && nari)
    return { front: 2, back: 2, side: 2, frontSide: 1, backSide: 1, night: 0, }; // 龍
  if (koma === 'k')
    return { front: 1, back: 1, side: 1, frontSide: 1, backSide: 1, night: 0, }; // 玉
  throw new Error('到達不能コード');
};
