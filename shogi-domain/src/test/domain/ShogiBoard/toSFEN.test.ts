import { ShogiBoard } from "../../../domain/ShogiBoard";
import { createShogiMove } from "../testUtil";

describe('ShogiBoard.toSFEN', () => {
  it('Initial Board', () => {
    expect(new ShogiBoard().toSFEN()).toBe(`lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1`);
  });
  it('適当な局面1', () => {
    const board = new ShogiBoard();
    board.adaptShogiMove(createShogiMove(`sp 77>76`));
    board.adaptShogiMove(createShogiMove(`gp 83>84`));
    board.adaptShogiMove(createShogiMove(`sp 27>26`));
    board.adaptShogiMove(createShogiMove(`gp 84>85`));
    board.adaptShogiMove(createShogiMove(`sb 88>77`));
    board.adaptShogiMove(createShogiMove(`gp 33>34`));
    board.adaptShogiMove(createShogiMove(`ss 79>88`));
    board.adaptShogiMove(createShogiMove(`gb 22>77!`));
    expect(board.toSFEN()).toBe(`lnsgkgsnl/1r7/p1pppp1pp/6p2/1p7/2P4P1/PP+bPPPP1P/1S5R1/LN1GKGSNL b b 1`);
  });
});
