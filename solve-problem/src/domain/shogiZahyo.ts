// SD座標系
// 9  8  7  6  5  4  3  2  1    ←S
//                           1
//                           2  ←D
//                           3
//                           4
//                           5
//                           6
//                           7
//                           8
//                           9
//
// IJ座標系
// 0  1  2  3  4  5  6  7  8    ←J
//                           0
//                           1
//                           2  ←I
//                           3
//                           4
//                           5
//                           6
//                           7
//                           8

/** sは筋、dは段。７六は{s:7, d:6} */
export type ShogiMasu = { s: number, d: number, };
/** i行j列を表す。i,jは0始まり。 */
export type ShogiMasuIJ = { i: number, j: number };

export const convertMasuSDToIJ = ({ d, s }: ShogiMasu): ShogiMasuIJ => ({ i: d - 1, j: 9 - s });
export const convertMasuIJToSD = ({ i, j }: ShogiMasuIJ): ShogiMasu => ({ s: 9 - j, d: i + 1 });
