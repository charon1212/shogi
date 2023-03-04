import { getKomaName, ShogiBoard, ShogiKoma, ShogiMove } from "./shogi";
import { ShogiMasu } from "./shogiZahyo";

type CreateShogiMoveArgs = { board: ShogiBoard, before: ShogiMasu, after: ShogiMasu, nari: boolean } | { board: ShogiBoard, after: ShogiMasu, uchi: ShogiKoma, };
export const createShogiMove = (args: CreateShogiMoveArgs): ShogiMove => {
  if ('uchi' in args) {
    const { board, after, uchi } = args;
    return { before: { d: 0, s: 0 }, after, uchi, sente: board.sente, nari: false, text: '' };
  } else {
    const { board, before, after } = args;
    return { before, after, sente: board.sente, nari: false, text: '' };
  }
};

const masuTextD: { [key in number]: string } = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', };
const masuTextS: { [key in number]: string } = { 1: '１', 2: '２', 3: '３', 4: '４', 5: '５', 6: '６', 7: '７', 8: '８', 9: '９', };
const getMasuText = (masu: ShogiMasu) => `${masuTextS[masu.s]}${masuTextD[masu.d]}`;

export const setShogiMoveText = (board: ShogiBoard, shogiMove: ShogiMove) => {
  const { before, after, nari, uchi } = shogiMove;
  const koma = uchi ?? board.board[before.s - 1][before.d - 1]!.koma;
  shogiMove.text = `${board.sente ? '▲' : '△'}${getMasuText(after)}${getKomaName(koma, false)}${nari ? '成' : ''}${uchi ? '打' : `${getMasuText(before)}`}`;
};
