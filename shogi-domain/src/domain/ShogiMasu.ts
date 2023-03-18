/**
 * sは筋、dは段。７六は{s:7, d:6}。
 */
export type ShogiMasuSD = { s: number, d: number, };

/**
 * i行j列を表す。i,jは0始まり。７六の地点は上から6行目左から3列目なので、0始まりにして{i:5, j:2}。
 */
export type ShogiMasuIJ = { i: number, j: number };

/**
 * ShogiMasuSDをShogiMasuIJに変換する。
 * @param masu SD座標のマス
 * @returns IJ座標のマス
 */
export const convertMasuSDToIJ = ({ d, s }: ShogiMasuSD): ShogiMasuIJ => ({ i: d - 1, j: 9 - s });

/**
 * ShogiMasuIJをShogiMasuSDに変換する。
 * @param masu IJ座標のマス
 * @returns SD座標のマス
 */
export const convertMasuIJToSD = ({ i, j }: ShogiMasuIJ): ShogiMasuSD => ({ s: 9 - j, d: i + 1 });

const masuTextD: { [key in number]: string } = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', };
const masuTextS: { [key in number]: string } = { 1: '１', 2: '２', 3: '３', 4: '４', 5: '５', 6: '６', 7: '７', 8: '８', 9: '９', };
/** マスのテキスト表現を取得する。「７六」等。 */
export const getMasuText = (masu: ShogiMasuSD) => `${masuTextS[masu.s]}${masuTextD[masu.d]}`;
/** マスのテキスト表現から、マスのオブジェクトを取得する。 */
export const getMasuFromText = (text: string): ShogiMasuSD | undefined => {
  if (text.length !== 2) return undefined;
  const findKey = (obj: { [key in any]: string }, value: string) => {
    for (let i in obj) if (obj[i] === value) return i;
    return undefined;
  };
  const s = +(findKey(masuTextS, text[0]) || 0);
  const d = +(findKey(masuTextD, text[1]) || 0);
  if (s < 1 || s > 9 || d < 1 || d > 9) return undefined;
  return { s, d };
};
