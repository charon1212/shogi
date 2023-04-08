import { createMochigomaTemplateEmpty, MochigomaSet } from "./Mochigoma";
import { ShogiKoma } from "./ShogiKoma";
import { ShogiMasuSD } from "./ShogiMasu";
import { ShogiMove } from "./ShogiMove";
import { createShogiTableTemplateInit, ShogiCell, ShogiTable } from "./ShogiTable";
import { ShogiBoard_getKomaDominance } from "./__getKomaDominance";
import { ShogiBoard_judgeMovable } from "./__judgeMovable";
import { ShogiBoard_toSFEN } from "./__sfen";

/**
 * 将棋の盤面を表現するクラス。
 * 盤面には、盤面情報・持ち駒・手番が含まれる。
 */
export class ShogiBoard {
  public sente: boolean;
  public mochigomaSet: MochigomaSet;
  public table: ShogiTable;

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
  /** 持ち駒一覧を取得する。 */
  getMochigoma(sente: boolean) { return sente ? this.mochigomaSet.sente : this.mochigomaSet.gote; }
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

  /**
   * 特定のマスの駒の利きがあるマスの一覧を取得する。
   * 指定したマスに駒が存在しない場合、空配列を返却する。
   *
   * - 利きがあるとは、駒が自身の移動手段で移動できることを示す。
   * - 合駒が自ら王手の制約により移動できない場合でも、その合駒は本来の利きを返却するので注意。
   * - また、敵・味方の駒が存在するマスも返却する。しかし、移動の間に合駒がある場合は返却しない。
   */
  getKomaDominance(masu: ShogiMasuSD): ShogiMasuSD[] { return ShogiBoard_getKomaDominance(this, masu); }

  /**
   * その移動が可能であるかどうかを判定する。判定内容は以下のとおり。
   * なお、王手に関する禁じ手（王手放置、自ら王手、連続王手の千日手）は判定しない。
   *
   * - 2手指し
   * - ★打ちの場合
   *   - 持っていない持ち駒の打ち
   *   - 駒の存在する場所への打ち
   *   - 2歩
   *   - これ以上進めないところへの打ち
   * - ★盤上の移動の場合
   *   - 移動元に駒がない
   *   - 移動先に自分の駒がある
   *   - 駒の利きの範囲外への移動
   *   - ★成りの場合
   *     - 成り駒の再度成り
   *     - 成れない駒の成り
   *     - 成れない移動の成り
   *   - ★成らずの場合
   *     - これ以上進めないところへの移動
   *
   * @returns 移動出来ない場合、その理由を文字列で返却する。移動できる場合、空文字を返却する。
   */
  judgeMovable(move: ShogiMove) { return ShogiBoard_judgeMovable(this, move); }

  /**
   * 現局面のsfenを返却する。
   *
   * @returns SFEN(Shogi Forsyth-Edwards Notation)表記法による局面と指し手の表記
   */
  toSFEN() {
    return ShogiBoard_toSFEN(this);
  }
}
