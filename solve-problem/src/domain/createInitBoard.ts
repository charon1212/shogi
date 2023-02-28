import { transpose } from "../util/transpose";
import { Mochigoma, ShogiBoard, ShogiCell, ShogiKoma } from "./shogi";

const createInitMochigoma = (): Mochigoma => ({ p: 0, l: 0, n: 0, s: 0, g: 0, r: 0, b: 0, k: 0, });
const s = (koma: ShogiKoma): ShogiCell => ({ koma, sente: true, nari: false });
const n = (koma: ' ') => null;
const g = (koma: ShogiKoma): ShogiCell => ({ koma, sente: false, nari: false });
/**
 * 参考：
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
const i = (): ShogiCell[][] => ([
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

export const createInitBoard = (): ShogiBoard => ({
  sente: true,
  board: transpose(i().map((v) => v.reverse())),
  mochigoma: { sente: createInitMochigoma(), gote: createInitMochigoma() },
});
