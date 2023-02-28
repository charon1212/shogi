import { ShogiMasu } from "./shogiZahyo";

/** 型定義 */
export type ShogiBoard = {
  sente: boolean,
  board: ShogiCell[][], // ７六の地点は、board[6][5]で参照する。
  mochigoma: { sente: Mochigoma, gote: Mochigoma },
};
export type ShogiMove = {
  before: ShogiMasu, // 打の場合は指定不要
  after: ShogiMasu,
  nari: boolean,
  uchi?: ShogiKoma,
  sente: boolean,
};
export type KifuMove = { move: ShogiMove, comment: string, next: KifuMove[], };
export type Kifu = {
  initialBoard?: ShogiBoard,
  moves: KifuMove[],
};

export type ShogiCell = { koma: ShogiKoma, sente: boolean, nari: boolean } | null;
export type Mochigoma = { [key in ShogiKoma]: number };
export type ShogiKoma =
  | 'p' // 歩
  | 'l' // 香
  | 'n' // 桂
  | 's' // 銀
  | 'g' // 金
  | 'r' // 飛
  | 'b' // 角
  | 'k'; // 玉

/** メソッド */
export const getKomaName = (koma: ShogiKoma, nari: boolean) => nari ? nariKomaNameMap[koma] : komaNameMap[koma];
const komaNameMap: { [key in ShogiKoma]: string } = { p: '歩', l: '香', n: '桂', s: '銀', g: '金', r: '飛', b: '角', k: '玉', };
const nariKomaNameMap: { [key in ShogiKoma]: string } = { p: 'と', l: '杏', n: '圭', s: '全', g: '☓', r: '龍', b: '馬', k: '☓', };
export const getAllShogiKoma = (): ShogiKoma[] => ['p', 'l', 'n', 's', 'g', 'r', 'b', 'k',];
