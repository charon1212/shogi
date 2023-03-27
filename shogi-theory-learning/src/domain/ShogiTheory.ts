import { ShogiKifu, ShogiKifuMove, ShogiMove } from "@charon1212/shogi-domain";
import { ShogiBoard } from "@charon1212/shogi-domain/build/domain/ShogiBoard";
import { formatInput, IF, MyTree } from "util-charon1212";

export type ShogiTheoryNode = { move: ShogiMove, comment: string, boardCount: string, check: boolean, };
export type ShogiTheory = {
  title: string,
  initBoard?: ShogiBoard,
  summary: string,
  theory: MyTree<ShogiTheoryNode>, // TODO: この形式だと、初期局面からの分岐（７六歩と２六歩の分岐等）ができない。。。
};

const convertNodeKifuToTheory = ({ move, comment }: ShogiKifuMove): ShogiTheoryNode => {
  const lines = comment.split('\r\n').flatMap((v) => v.split('\n'));
  const firstLine = lines[0];
  const lastLine = lines[lines.length - 1];
  const boardCountFormatter = formatInput(firstLine, '#%図') || formatInput(firstLine, '%図');
  const boardCount = boardCountFormatter ? boardCountFormatter[0] : '';
  if (boardCountFormatter) lines.shift();
  const check = lastLine === '★Point';
  if (check) lines.pop();
  return { move, comment: lines.join('\r\n'), boardCount, check };
};

export const convertShogiKifuToShogiTheory = (kifu: ShogiKifu): ShogiTheory => {
  return {
    title: '',
    summary: kifu.firstComment,
    theory: kifu.kifu.length === 0 ? new MyTree() : kifu.kifu[0].map<ShogiTheoryNode>((value, node) => convertNodeKifuToTheory(value)),
    initBoard: kifu.initialBoard,
  }
};

const convertNodeTheoryToKifu = ({ move, comment, boardCount, check }: ShogiTheoryNode): ShogiKifuMove => {
  const convertComment = (boardCount ? `#${boardCount}図\r\n` : '') + comment + (check ? '\r\n★Point' : '');
  return { move, comment: convertComment };
};

export const convertShogiTheoryToShogiKifu = (theory: ShogiTheory): ShogiKifu => {
  const newTree = theory.theory.map((value) => convertNodeTheoryToKifu(value));
  return {
    initialBoard: theory.initBoard,
    firstComment: theory.summary,
    kifu: newTree.root === undefined ? [] : [newTree],
  };
};
