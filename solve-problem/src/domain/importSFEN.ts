import { transpose } from "../util/transpose";
import { Mochigoma, ShogiBoard, ShogiCell, ShogiKoma } from "./shogi";

export const importSFEN = (sfen: string): ShogiBoard | null => {
  if (sfen.startsWith('sfen ')) sfen = sfen.substring('sfen '.length);
  const items = sfen.split(' ');
  if (items.length < 3) return null;

  // item1 - 盤面
  const lines = items[0].split('/');
  if (lines.length !== 9) return null;
  const boardIJ: ShogiCell[][] = [];
  for (let line of lines) {
    const boardIJLine: ShogiCell[] = [];
    let nari = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '+') {
        if (nari) return null;
        nari = true;
      } else if (/[1-9]/.test(c)) {
        if (nari) return null;
        boardIJLine.push(...[...Array(+c)].map(() => null))
      } else if (/[plnshkbrPLNSHKBR]/.test(c)) {
        const koma = c.toLowerCase() as ShogiKoma;
        const sente = /[A-Z]/.test(c);
        boardIJLine.push({ koma, nari, sente });
        nari = false;
      } else {
        return null;
      }
    }
    if (boardIJLine.length !== 9) return null;
    boardIJ.push(boardIJLine);
  }
  const board = transpose(boardIJ.map((v) => v.reverse()));

  // item2 - 手番
  if (items[1] !== 'b' && items[1] !== 'w') return null;
  const sente = items[1] === 'b';

  // item3 - 持ち駒
  const mochigoma: { sente: Mochigoma, gote: Mochigoma } = {
    sente: { p: 0, l: 0, n: 0, s: 0, g: 0, r: 0, b: 0, k: 0, },
    gote: { p: 0, l: 0, n: 0, s: 0, g: 0, r: 0, b: 0, k: 0, },
  };
  // TODO: 持ち駒追加
  if (items[2] !== '-') {

  }

  return { board, sente, mochigoma };
};
