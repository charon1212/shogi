import { Arr } from "util-charon1212";
import { ShogiBoard } from "./ShogiBoard";
import { getAllShogiKoma } from "./ShogiKoma";
import { ShogiKoma } from "./ShogiKoma";

const arr9 = Arr(1, 10); // [1,2,3,4,5,6,7,8,9]
export const ShogiBoard_toSFEN = (shogiBoard: ShogiBoard) => {

  const board = arr9.map((d) => {
    let line = '';
    let noCell = 0;
    for (let s = 9; s >= 1; s--) {
      const c = shogiBoard.getCell({ s, d });
      if (c) {
        if (noCell) line += `${noCell}`;
        noCell = 0;
        if (c.nari) line += '+';
        line += convert(sfenMap1[c.koma], c.sente);
      } else {
        noCell++;
      }
    }
    if (noCell) line += `${noCell}`;
    return line;
  }).join('/');

  const mochigoma = [true, false].map((sente) => getAllShogiKoma().map((koma) => {
    const num = shogiBoard.getMochigoma(sente)[koma];
    return num > 0 ? `${num === 1 ? '' : num}${convert(sfenMap1[koma], sente)}` : ``;
  }).join('')).join('');
  return `${board} ${shogiBoard.sente ? 'b' : 'w'} ${mochigoma || '-'} 1`;
};

const convert = (koma: string, sente: boolean) => sente ? koma.toUpperCase() : koma.toLowerCase();
const sfenMap1: { [koma in ShogiKoma]: string } = { p: 'p', l: 'l', n: 'n', s: 's', g: 'g', r: 'r', b: 'b', k: 'k', };
const sfenMap2: { [key: string]: { koma: ShogiKoma, sente: boolean } } = {
  p: { koma: 'p', sente: false },
  l: { koma: 'l', sente: false },
  n: { koma: 'n', sente: false },
  s: { koma: 's', sente: false },
  g: { koma: 'g', sente: false },
  r: { koma: 'r', sente: false },
  b: { koma: 'b', sente: false },
  k: { koma: 'k', sente: false },
  P: { koma: 'p', sente: true },
  L: { koma: 'l', sente: true },
  N: { koma: 'n', sente: true },
  S: { koma: 's', sente: true },
  G: { koma: 'g', sente: true },
  R: { koma: 'r', sente: true },
  B: { koma: 'b', sente: true },
  K: { koma: 'k', sente: true },
};
