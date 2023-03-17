import { ShogiKoma } from "./ShogiKoma";

/**
 * 将棋テーブルの1マスの情報
 */
export type ShogiCell = { koma: ShogiKoma, sente: boolean, nari: boolean } | null;

/**
 * 将棋テーブル
 * 基本的に、SD座標で保存する。
 */
export type ShogiTable = ShogiCell[][];

const transposeArray = <T>(source: T[][]): T[][] => source[0].map((_, c) => source.map(r => r[c]));

/**
 * IJ座標ベースで表現されたShogiTableをSD座標に変換する。
 */
export const convertShogiTableIJtoSD = (table: ShogiTable) => transposeArray(table.map((v) => [...v].reverse()));

/**
 * SD座標で表現されたShogiTableをIJ座標に変換する。
 */
export const convertShogiTableSDtoIJ = (table: ShogiTable) => transposeArray(table).map((v) => [...v].reverse());

// ■ ■ ■ ■ テンプレート ■ ■ ■ ■
const s = (koma: ShogiKoma): ShogiCell => ({ koma, sente: true, nari: false });
const n = (koma: ' ') => null;
const g = (koma: ShogiKoma): ShogiCell => ({ koma, sente: false, nari: false });

/**
 * 初期盤面(IJ座標系)
 */
const boardInit = (): ShogiTable => [
  [g('l'), g('n'), g('s'), g('g'), g('k'), g('g'), g('s'), g('n'), g('l'),], // 1段
  [n(' '), g('r'), n(' '), n(' '), n(' '), n(' '), n(' '), g('b'), n(' '),], // 2段
  [g('p'), g('p'), g('p'), g('p'), g('p'), g('p'), g('p'), g('p'), g('p'),], // 3段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 4段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 5段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 6段
  [s('p'), s('p'), s('p'), s('p'), s('p'), s('p'), s('p'), s('p'), s('p'),], // 7段
  [n(' '), s('b'), n(' '), n(' '), n(' '), n(' '), n(' '), s('r'), n(' '),], // 8段
  [s('l'), s('n'), s('s'), s('g'), s('k'), s('g'), s('s'), s('n'), s('l'),], // 9段
];
/**
 * 空盤面(SD座標系)
 */
const boardEmpty = (): ShogiTable => [
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 1段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 2段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 3段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 4段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 5段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 6段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 7段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 8段
  [n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '), n(' '),], // 9段
];

/**
 * 初期テーブルを作成する。
 */
export const createShogiTableTemplateInit = (): ShogiTable => convertShogiTableIJtoSD(boardInit());

/**
 * 空テーブルを作成する。
 */
export const createShogiTableTemplateEmpty = (): ShogiTable => convertShogiTableIJtoSD(boardEmpty());
