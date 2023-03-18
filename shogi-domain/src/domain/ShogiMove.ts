import { ShogiKoma } from "./ShogiKoma";
import { ShogiMasuSD } from "./ShogiMasu";

/**
 * 将棋の差し手を表すオブジェクト。
 */
export type ShogiMove =
  {
    uchi: false,
    before: ShogiMasuSD,
    after: ShogiMasuSD,
    nari: boolean,
    koma: ShogiKoma,
    narikoma: boolean,
    sente: boolean,
  } |
  {
    uchi: true
    after: ShogiMasuSD,
    koma: ShogiKoma,
    sente: boolean,
  };
