import { ShogiBoard, ShogiMove } from "./shogi";

/** 型定義 */
export type ShogiProblem = {
  moves: ShogiMove[],
  startMoveCount: number,
  questionMoveCount: number,
  questionComment: string,
  answerComment: string,
};
export type ShogiProblemUnit = {
  origin: ShogiBoard,
  problems: ShogiProblem[],
};
export type ShogiProblemSet = {
  title: string,
  problemUnits: ShogiProblemUnit[],
};

/** メソッド */
export const createProblemSetSaveData = (problemSet: ShogiProblemSet) => [`${problemSet.title}.ssp`, JSON.stringify(problemSet)] as const;
export const loadProblemSet = (content: string) => JSON.parse(content) as ShogiProblemSet;
