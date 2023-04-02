import { getKomaName1Char, getMasuText, ShogiMove } from "@charon1212/shogi-domain";

export const getMoveText = (move: ShogiMove, beforeMove: ShogiMove | undefined) =>
  (move.sente ? '▲' : '△') +
  (move.after.d === beforeMove?.after.d && move.after.s === beforeMove?.after.s ? '同' : getMasuText(move.after)) +
  getKomaName1Char(move.koma, move.uchi ? false : move.narikoma);
