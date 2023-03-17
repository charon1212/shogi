import { ShogiBoard } from "./ShogiBoard";
import { ShogiKoma } from "./ShogiKoma";
import { ShogiMasuSD } from "./ShogiMasu";

/**
 * 実装だけ複雑なため、このファイルで行う。
 * 関数仕様はShogiBoard.getKomaDominanceを参照。
 */
export const ShogiBoard_getKomaDominance = (board: ShogiBoard, masu: ShogiMasuSD): ShogiMasuSD[] => {
  const cell = board.getCell(masu);
  if (!cell) return [];
  const { koma, nari, sente } = cell;
  const moveSort = getMoveSort(koma, nari);
  // dxは横方向、dyは縦方向を示す。xは指し手側から見て右を正に、yは差し手側から見て前を正にとる。
  const c = (dx: number, dy: number): ShogiMasuSD => sente ? ({ s: masu.s - dx, d: masu.d - dy }) : ({ s: masu.s + dx, d: masu.d + dy });
  const result: ShogiMasuSD[] = [];
  for (let key of moveSortKeys) {
    const moveSortValue = moveSort[key];
    if (moveSortValue === 0) continue;
    const { ux, uy } = moveUnitMap[key];
    const maxMoveDistance = moveSortValue === 1 ? 1 : 8; // moveSortValueが1であれば、以下のfor文を1回のみにとどめる。2であれば、最大距離8までfor文を回す。
    const f = (ix: number, iy: number) => {
      for (let i = 1; i <= maxMoveDistance; i++) {
        const m = c(ix * i, iy * i);
        if (m.s < 1 || m.s > 9 || m.d < 1 || m.d > 9) break;
        result.push(m);
        if (board.getCell(m)) break;
      }
    };
    f(ux, uy);
    if (ux !== 0) f(-ux, uy);
  }
  return result;
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
const moveUnitMap: { [key in keyof MoveSort]: { ux: number, uy: number } } = {
  front: { ux: 0, uy: +1, }, // 前移動
  back: { ux: 0, uy: -1, }, // 後移動
  side: { ux: 1, uy: 0, }, // 横移動
  frontSide: { ux: 1, uy: 1, }, // 前横移動
  backSide: { ux: 1, uy: -1, }, // 後横移動
  night: { ux: 1, uy: 2, }, // 桂馬移動
};
const moveSortKeys: (keyof MoveSort)[] = ['front', 'back', 'side', 'frontSide', 'backSide', 'night',];

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
