import { ShogiKoma } from "../../domain/ShogiKoma";
import { ShogiMove } from "../../domain/ShogiMove";

/**
 * ShogiMoveを簡易的に作成。
 *
 * @param text 次の文字列表現：{sente}{koma}{narikoma}{before}">"{after}{nari}
 *
 * - {sente}はs,gのいずれかを指定。
 * - {koma}は移動または打つ駒の種類を指定する。
 * - {narikoma}は移動する駒が成り駒の場合は'!'を、そうでなければ' 'を指定する。打つ場合は常に' 'を指定する。
 * - {before}は"  "または2桁の数値を指定。打ちの場合は空白。
 * - {before}と{after}の間は固定値">"を設定。
 * - {after}は2桁の数値を指定。
 * - {nari}は、移動成の場合に'!'を指定する。
 *
 * @example
 *
 * ```ts
 * createShogiMove('sn 77>76');
 * createShogiMove('sb 88>22!');
 * createShogiMove('gn   >76');
 * ```
 */
export const createShogiMove = (text: string): ShogiMove => text.substring(3, 5) === '  ' ?
  ({
    uchi: true,
    sente: text[0] === 's',
    after: { s: +text[6], d: +text[7] },
    koma: text[1] as ShogiKoma
  })
  : ({
    uchi: false,
    sente: text[0] === 's',
    after: { s: +text[6], d: +text[7] },
    koma: text[1] as ShogiKoma,
    narikoma: text[2] === '!',
    before: { s: +text[3], d: +text[4] },
    nari: text[8] === '!',
  });
