import { ShogiKifu, ShogiKifuMove } from "./ShogiKifu";
import { MyTree, MyNode, formatInput, IF } from 'util-charon1212';
import { getMasuFromText, ShogiMasuSD } from "./ShogiMasu";
import { ShogiKoma } from "./ShogiKoma";
import { ShogiMove } from "./ShogiMove";

export const readKifFile = (content: string): { shogiKifu: ShogiKifu, headers: { key: string, value: string }[] } => {
  const lines = content.split('\r\n').map((v) => v.split('\n')).reduce((p, c) => [...p, ...c], []);
  const headers: { key: string, value: string }[] = [];
  const shogiKifu: ShogiKifu = { firstComment: '', kifu: [], };
  let currentNode: MyNode<ShogiKifuMove> | undefined;
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (line.startsWith('#')) continue; // コメント行
    if (line.startsWith('&')) continue; // しおり行は無視
    if (line.startsWith('*')) { // 棋譜コメント行
      if (currentNode) currentNode.value.comment += line.substring(1) + '\n';
      else shogiKifu.firstComment += line.substring(1) + '\n';
      continue;
    }
    if (line.startsWith('変化：') && currentNode) {
      const input = formatInput(line, '変化：%手');
      if (input) {
        const moveCount = +input[0];
        if (isNaN(moveCount)) throw new Error(`無効行：${line}`);
        if (moveCount === 1) {
          currentNode = undefined;
        } else {
          const path = currentNode.getPath();
          if (moveCount > path.length) throw new Error(`無効な変化。パスの深さ${path.length}に対し、この手数の変化は登録できません：${line}`);
          // 例えば「変化：52手」の場合、currentNodeを51手目のNodeにするため、51-1番目の要素まで戻す。
          currentNode = path[moveCount - 2];
        }
      }
      continue;
    }
    const index = line.indexOf('：');
    if (index >= 0) {
      headers.push({ key: line.substring(0, index), value: line.substring(index + 1) });
      continue;
    }
    // これ以降、差し手の表現を判定する。
    const spaceItems = line.split(' ').filter((v) => v); // 空白で区切り、0文字を除去。
    if (spaceItems.length < 2) continue;
    const moveCount = +spaceItems[0];
    if (isNaN(moveCount)) continue;
    const sente = moveCount % 2 === 1; // TODO: 平手スタート前提の手番決定。奇数番手（1,3,5）は先手とし、偶数番手（2,4,6）は後手とする。
    const sasite = parseSasite(spaceItems[1]);
    if (sasite) {
      const after = sasite.after === '同' ? currentNode?.value.move.after : sasite.after;
      if (!after) throw new Error(`無効な差し手。初期局面で同xxの差し手が示されました。${line}`);
      const { value: newMove } = IF(sasite.before === '打', {
        t: (): ShogiMove => ({ uchi: true, after, koma: sasite.koma, sente, }),
        f: (): ShogiMove => ({ uchi: false, before: sasite.before as ShogiMasuSD, after, nari: sasite.nari, sente }),
      });
      if (currentNode) {
        currentNode = currentNode.addChild({ move: newMove, comment: '' });
      } else {
        const newTree = new MyTree({ move: newMove, comment: '' });
        shogiKifu.kifu.push(newTree);
        currentNode = newTree.root;
      }
    }
  }
  return { headers, shogiKifu };
};

/**
 * Kif形式の差し手表現を解釈する。
 * 差し手表現の形式は、次の通り。[]は省略可能である。
 * 基本は次を参照した：http://kakinoki.o.oo7.jp/kif_format.html
 * ただし、「打」は移動元座標の表現に含めるよう修正している。でないと、打つ場合に必須指定の移動元座標へ指定する値がない。
 *
 * <指し手> = [<手番>]<移動先座標><駒>[<装飾子>]<移動元座標>
 *
 * - <手番>: 省略可能。▲または△のいずれか。
 * - <移動先座標>: 「７六」のような表現か、または「同」または「同　」のいずれか。
 * - <駒>: 駒名。次のいずれか：玉、飛、龍、竜、角、馬、金、銀、成銀、全、桂、成桂、圭、香、成香、杏、歩、と
 * - <装飾子>: 省略可能。この移動で駒が成る場合、「成」を記載する。
 * - <移動元座標>: 「打」または、移動元のマスを示す。マスの表現は、半角括弧で囲んだ半角数値2桁で、1桁目が筋、2桁目が段を表し、1～9で表現する。
 */
type ParseSasiteResult = { after: '同' | ShogiMasuSD, koma: ShogiKoma, narikoma: boolean, nari: boolean, before: '打' | ShogiMasuSD };
const parseSasite = (source: string): ParseSasiteResult | undefined => {
  // <手番>
  if (source.startsWith('▲') || source.startsWith('△')) source = source.substring(1); // 手番を削除。

  // <移動先座標>
  const { value: after } = IF(source.startsWith('同'), {
    t: () => { source = source.substring(1); return '同' as const; },
    f: () => {
      const text = source.substring(0, 2);
      source = source.substring(2);
      return text === '同　' ? '同' : getMasuFromText(text);
    },
  });
  if (!after) return undefined;

  // <駒>
  const koma1 = KifKomaNameMap1[source.substring(0, 1)];
  const koma2 = KifKomaNameMap2[source.substring(0, 2)];
  const { value: koma } = IF(koma2 !== undefined, {
    t: () => { source = source.substring(2); return koma2; },
    f: () => { source = source.substring(1); return koma1; },
  });
  if (koma === undefined) return undefined;

  // <装飾子>
  const { value: nari } = IF(source.startsWith('成'), {
    t: () => { source = source.substring(1); return true; },
    f: () => false,
  });

  // <移動元座標>
  const { value: before } = IF(source.startsWith('打'), {
    t: () => '打' as const,
    f: () => {
      const input = formatInput(source, '(%)%');
      if (!input || !input[0]) return undefined;
      const s = +input[0][0];
      const d = +input[0][1];
      if (isNaN(s) || s < 1 || s > 9 || isNaN(d) || d < 1 || d > 9) return undefined;
      return { s, d };
    },
  });
  if (!before) return undefined;

  return { after, koma: koma.koma, narikoma: koma.nari, nari, before, };
};

const KifKomaNameMap1: { [key in string]: { koma: ShogiKoma, nari: boolean } } = { '玉': { koma: 'k', nari: false, }, '飛': { koma: 'r', nari: false, }, '龍': { koma: 'r', nari: true, }, '竜': { koma: 'r', nari: true, }, '角': { koma: 'b', nari: false, }, '馬': { koma: 'b', nari: true, }, '金': { koma: 'g', nari: false, }, '銀': { koma: 's', nari: false, }, '全': { koma: 's', nari: true, }, '桂': { koma: 'n', nari: false, }, '圭': { koma: 'n', nari: true, }, '香': { koma: 'l', nari: false, }, '杏': { koma: 'l', nari: true, }, '歩': { koma: 'p', nari: false, }, 'と': { koma: 'p', nari: true, }, };
const KifKomaNameMap2: { [key in string]: { koma: ShogiKoma, nari: boolean } } = { '成銀': { koma: 's', nari: true }, '成桂': { koma: 'n', nari: true }, '成香': { koma: 'l', nari: true }, };


// export const writeKifFile = (kif: ShogiKifu): string => { };
