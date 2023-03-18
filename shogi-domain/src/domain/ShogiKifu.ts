import { MyTree } from "util-charon1212";
import { ShogiBoard } from "./ShogiBoard";
import { ShogiMove } from "./ShogiMove";

export type ShogiKifuMove = { move: ShogiMove, comment: string };

export type ShogiKifu = {
  initialBoard?: ShogiBoard,
  firstComment: string,
  kifu: MyTree<ShogiKifuMove>[],
};
