import { deepCopy } from "../util/deepCopy";
import { transpose } from "../util/transpose";
import { Mochigoma, ShogiBoard, ShogiCell, ShogiKoma } from "./shogi";

/** 適当な関数 */
const s = (koma: ShogiKoma): ShogiCell => ({ koma, sente: true, nari: false });
const n = (koma: ' ') => null;
const g = (koma: ShogiKoma): ShogiCell => ({ koma, sente: false, nari: false });
const t = <T>(arr: T[][]) => transpose(arr.map((v) => v.reverse()))

/** ■ ■ ■ ■ 盤面のサンプル ■ ■ ■ ■ */
/**
 * 初期盤面
 * 香桂銀金玉金銀桂香
 * 　飛　　　　　角　
 * 歩歩歩歩歩歩歩歩歩
 * 　　　　　　　　　
 * 　　　　　　　　　
 * 　　　　　　　　　
 * 歩歩歩歩歩歩歩歩歩
 * 　角　　　　　飛　
 * 香桂銀金玉金銀桂香
*/
const boardInit: ShogiCell[][] = t([
  [g('l'), g('n'), g('s'), g('g'), g('k'), g('g'), g('s'), g('n'), g('l'),], // 1段
  [n(' '), g('r'), n(' '), n(' '), n(' '), n(' '), n(' '), g('b'), n(' '),], // 2段
  [g('p'), g('p'), g('p'), g('p'), g('p'), g('p'), g('p'), g('p'), g('p'),], // 3段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 4段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 5段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 6段
  [s('p'), s('p'), s('p'), s('p'), s('p'), s('p'), s('p'), s('p'), s('p'),], // 7段
  [n(' '), s('b'), n(' '), n(' '), n(' '), n(' '), n(' '), s('r'), n(' '),], // 8段
  [s('l'), s('n'), s('s'), s('g'), s('k'), s('g'), s('s'), s('n'), s('l'),], // 9段
]);
/**
 * 空盤面
*/
const boardEmpty: ShogiCell[][] = t([
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 1段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 2段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 3段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 4段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 5段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 6段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 7段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 8段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 9段
]);

/** ■ ■ ■ ■ 持ち駒のサンプル ■ ■ ■ ■ */
const mochigomaEmpty: Mochigoma = { p: 0, l: 0, n: 0, s: 0, g: 0, r: 0, b: 0, k: 0, };
const mochigomaHalf: Mochigoma = { p: 9, l: 2, n: 2, s: 2, g: 2, r: 1, b: 1, k: 1, };
const mochigomaFull: Mochigoma = { p: 18, l: 4, n: 4, s: 4, g: 4, r: 2, b: 2, k: 2, };

/** ■ ■ ■ ■ テンプレート ■ ■ ■ ■ */
const shogiBoardInit: ShogiBoard = { board: boardInit, mochigoma: { sente: mochigomaEmpty, gote: mochigomaEmpty }, sente: true, };
const shogiBoardAllMochigoma: ShogiBoard = { board: boardEmpty, mochigoma: { sente: mochigomaHalf, gote: mochigomaHalf }, sente: true, };
const shogiBoardTsume: ShogiBoard = { board: boardEmpty, mochigoma: { sente: mochigomaEmpty, gote: mochigomaFull }, sente: true, };

export const createShogiBoardInit = () => deepCopy(shogiBoardInit);
export const createShogiBoardAllMochigoma = () => deepCopy(shogiBoardAllMochigoma);
export const createShogiBoardTsume = () => deepCopy(shogiBoardTsume);
