import { ShogiKoma } from "../../domain/ShogiKoma";
import { ShogiMove } from "../../domain/ShogiMove";

/**
 * ShogiMoveを簡易的に作成。
 *
 * @param text 次の文字列表現：{sente}{before}">"{after}{koma | nari}
 *
 * - {sente}はs,gのいずれかを指定。
 * - {before}は"  "または2桁の数値を指定。打ちの場合は空白。
 * - {before}と{after}の間は固定値">"を設定。
 * - {after}は2桁の数値を指定。
 * - {koma | nari}は、打つ場合は打つ駒を'plnsgbrk'のいずれかで指定、移動成の場合は'!'を記載。
 *
 * @example
 *
 * ```ts
 * createShogiMove('s77>76');
 * createShogiMove('s88>22!');
 * createShogiMove('g  >76n');
 * ```
 */
export const createShogiMove = (text: string): ShogiMove => text.substring(1, 3) === '  ' ?
  ({ uchi: true, sente: text[0] === 's', after: { s: +text[4], d: +text[5] }, koma: text[6] as ShogiKoma })
  : ({ uchi: false, sente: text[0] === 's', before: { s: +text[1], d: +text[2] }, after: { s: +text[4], d: +text[5] }, nari: text[6] === '!' });
