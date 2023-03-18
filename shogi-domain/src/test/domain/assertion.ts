import { ShogiMove } from "../../domain/ShogiMove";

export const assertShogiMove = (exp: ShogiMove, act: ShogiMove) => {
  const fa = () => { throw new Error(`[assertShogiMove]assert error. ${JSON.stringify({ exp, act })}`) };
  if (act.uchi !== exp.uchi) fa();
  if (exp.uchi && act.uchi) {
    if (act.koma !== exp.koma) fa();
    if (act.sente !== exp.sente) fa();
    if (act.after.s !== exp.after.s) fa();
    if (act.after.d !== exp.after.d) fa();
  }
  if (!exp.uchi && !act.uchi) {
    if (act.nari !== exp.nari) fa();
    if (act.sente !== exp.sente) fa();
    if (act.before.s !== exp.before.s) fa();
    if (act.before.d !== exp.before.d) fa();
    if (act.after.s !== exp.after.s) fa();
    if (act.after.d !== exp.after.d) fa();
  }
};
