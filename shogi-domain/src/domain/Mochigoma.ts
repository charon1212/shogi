import { ShogiKoma } from "./ShogiKoma";

/**
 * 先手・後手いずれかの持ち駒。
 */
export type Mochigoma = { [key in ShogiKoma]: number };

/**
 * 先手後手の持ち駒のセット。
 */
export type MochigomaSet = { sente: Mochigoma, gote: Mochigoma };

/**
 * 持ち駒のテンプレート（全て空）
 */
export const createMochigomaTemplateEmpty = (): Mochigoma => ({ p: 0, l: 0, n: 0, s: 0, g: 0, r: 0, b: 0, k: 0, });
/**
 * 持ち駒のテンプレート（全駒の半分）
 */
export const createMochigomaTemplateHalf = (): Mochigoma => ({ p: 9, l: 2, n: 2, s: 2, g: 2, r: 1, b: 1, k: 1, });
/**
 * 持ち駒のテンプレート（全駒）
 */
export const createMochigomaTemplateFull = (): Mochigoma => ({ p: 18, l: 4, n: 4, s: 4, g: 4, r: 2, b: 2, k: 2, });
