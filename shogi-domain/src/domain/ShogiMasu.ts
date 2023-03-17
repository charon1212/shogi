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
