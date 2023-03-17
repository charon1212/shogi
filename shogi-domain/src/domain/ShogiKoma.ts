/**
 * 将棋の駒を表す列挙
 * 成り駒は含まないので注意
 */
export type ShogiKoma =
  | 'p' // 歩
  | 'l' // 香
  | 'n' // 桂
  | 's' // 銀
  | 'g' // 金
  | 'r' // 飛
  | 'b' // 角
  | 'k'; // 玉

const komaNameMap: { [key in ShogiKoma]: string } = { p: '歩', l: '香', n: '桂', s: '銀', g: '金', r: '飛', b: '角', k: '玉', };
const nariKomaNameMap: { [key in ShogiKoma]: string } = { p: 'と', l: '杏', n: '圭', s: '全', g: '', r: '龍', b: '馬', k: '', };

/**
 * 駒の1文字名を取得する。
 * @param koma 駒の種類
 * @param nari 成りの有無
 * @returns 金と玉で成りを指定した場合は空欄を返却する。
 */
export const getKomaName1Char = (koma: ShogiKoma, nari: boolean) => nari ? nariKomaNameMap[koma] : komaNameMap[koma];

/**
 * 全ての駒のリストを取得する。
 */
export const getAllShogiKoma = (): ShogiKoma[] => ['p', 'l', 'n', 's', 'g', 'r', 'b', 'k',];
