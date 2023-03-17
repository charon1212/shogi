import { createMochigomaTemplateEmpty, MochigomaSet } from "./Mochigoma";
import { ShogiKoma } from "./ShogiKoma";
import { ShogiMasuSD } from "./ShogiMasu";
import { ShogiMove } from "./ShogiMove";
import { createShogiTableTemplateInit, ShogiCell, ShogiTable } from "./ShogiTable";

/**
 * 将棋の盤面を表現するクラス。
 * 盤面には、盤面情報・持ち駒・手番が含まれる。
 */
export class ShogiBoard {
  private sente: boolean;
  private mochigomaSet: MochigomaSet;
  private table: ShogiTable;

  constructor(board?: ShogiBoard) {
    if (board) {
      this.sente = board.sente;
      this.mochigomaSet = board.mochigomaSet;
      this.table = board.table;
    } else {
      this.sente = true;
      this.mochigomaSet = { sente: createMochigomaTemplateEmpty(), gote: createMochigomaTemplateEmpty(), };
      this.table = createShogiTableTemplateInit();
    }
  }
  /** オブジェクトコピーを生成する。 */
  shallowCopy() { return new ShogiBoard(this); }
  /**
   * 持ち駒の数を増減する。
   * @param sente 先手はtrue、後手はfalse。
   * @param koma 対象の駒の種類
   * @param delta 増減する値。増加させる場合はプラスの値を指定する。
   */
  addMochigoma(sente: boolean, koma: ShogiKoma, delta: number) {
    if (sente) this.mochigomaSet.sente[koma] += delta;
    else this.mochigomaSet.gote[koma] += delta;
    return this;
  }
  /** 特定のマスのセル値を取得する。 */
  getCell(masu: ShogiMasuSD) { return this.table[masu.s - 1][masu.d - 1]; }
  /** 特定のマスのセル値を設定する。 */
  setCell(masu: ShogiMasuSD, cell: ShogiCell) {
    this.table[masu.s - 1][masu.d - 1] = cell;
    return this;
  }

  /**
   * 盤面に指し手を適用する。
   * 指しての妥当性は一切チェックしない。
   * 手番は「!move.sente」に変更されるので注意。
   */
  adaptShogiMove(move: ShogiMove) {
    if (move.uchi) {
      const { after, koma, sente } = move;
      this.setCell(after, { koma, nari: false, sente }); // 移動先の入れ替え
      this.addMochigoma(sente, koma, -1); // 持ち駒の削除
    } else {
      const { before, after, nari, sente } = move;
      const afterCell = this.getCell(after);
      if (afterCell) this.addMochigoma(sente, afterCell.koma, +1); // 持ち駒の回収
      this.setCell(after, this.getCell(before)); // 移動先の入れ替え
      this.setCell(before, null); // 移動元の削除
      if (nari) this.getCell(after)!.nari = true; // 成りの操作
    }
    this.sente = !move.sente; // 先後入れ替え
    return this;
  }
}
