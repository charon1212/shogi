import {
  ShogiBoard,
  ShogiMasuSD,
  ShogiMasuIJ,
  convertMasuIJToSD,
  ShogiKoma,
  getKomaName1Char,
  ShogiCell,
  getAllShogiKoma,
  Mochigoma,
} from '@charon1212/shogi-domain';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import LoopIcon from '@mui/icons-material/Loop';
import { transpose } from '../util';

const shogiCellSizePx = 30;

type Props = {
  board: ShogiBoard;
  colorBoard?: { masu: ShogiMasuSD; color: string }[];
  colorMochigoma?: { sente: boolean; koma: ShogiKoma; color: string }[];
  onClickBoard?: (masu: ShogiMasuSD) => unknown;
  onClickMochigoma?: (koma: ShogiKoma, sente: boolean) => unknown;
  onRightClickBoard?: (masu: ShogiMasuSD) => unknown;
  onRightClickMochigoma?: (koma: ShogiKoma, sente: boolean) => unknown;
  allowMochigomaKing?: boolean;
};
export const ShogiBoardView = (props: Props) => {
  const { board, colorBoard, colorMochigoma, onClickBoard, onClickMochigoma, onRightClickBoard, onRightClickMochigoma, allowMochigomaKing } = props;
  const [reverse, setReverse] = useState(false);
  const drawBoard = reverse ? transpose(board.table.map((v) => [...v].reverse())) : transpose(board.table).map((v) => [...v].reverse());
  const getColor = (masu: ShogiMasuIJ) => {
    const { s, d } = convertMasuIJToSD(masu);
    return colorBoard?.find((c) => c.masu.s === s && c.masu.d === d)?.color ?? '';
  };

  const getMasuIJ = (masu: ShogiMasuIJ): ShogiMasuIJ => (reverse ? { i: 8 - masu.i, j: 8 - masu.j } : masu);

  const mochigoma = (sente: boolean) => (
    <MochigomaView
      title={sente ? '先手' : '後手'}
      mochigoma={board.getMochigoma(sente)}
      bgColor={(koma) => colorMochigoma?.find((v) => v.sente === sente && v.koma === koma)?.color}
      onClick={(koma) => onClickMochigoma?.(koma, sente)}
      onRightClick={(koma) => onRightClickMochigoma?.(koma, sente)}
      allowMochigomaKing={allowMochigomaKing ?? false}
    />
  );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', width: 'fit-content' }}>
        <div>{reverse ? mochigoma(true) : mochigoma(false)}</div>
        <div style={{ display: 'flex', flexDirection: 'column', width: 'fit-content', border: '1px solid' }}>
          {drawBoard.map((v, i) => (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {v.map((w, j) => (
                <ShogiCellView
                  cell={w}
                  rotate={w?.sente === reverse} // reverseがtrueなら、後手番目線なので、先手の駒を反転する。vice versa
                  bgColor={getColor(getMasuIJ({ i, j }))}
                  onClick={() => onClickBoard?.(convertMasuIJToSD(getMasuIJ({ i, j })))}
                  onRightClick={() => onRightClickBoard?.(convertMasuIJToSD(getMasuIJ({ i, j })))}
                />
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <IconButton size={'large'} onClick={() => setReverse(!reverse)}>
              <LoopIcon />
            </IconButton>
          </div>
          {reverse ? mochigoma(false) : mochigoma(true)}
        </div>
      </div>
    </>
  );
};

type PropsMochigomaView = {
  title: string;
  mochigoma: Mochigoma;
  bgColor: (koma: ShogiKoma) => string | undefined;
  onClick: (koma: ShogiKoma) => unknown;
  onRightClick: (koma: ShogiKoma) => unknown;
  allowMochigomaKing: boolean;
};
const MochigomaView = ({ title, mochigoma, bgColor, onClick, allowMochigomaKing }: PropsMochigomaView) => (
  <div style={{ margin: '10px', minWidth: '70px', textAlign: 'center' }}>
    <div>{title}</div>
    {getAllShogiKoma()
      .filter((v) => allowMochigomaKing || v !== 'k')
      .map((koma) => (
        <div style={{ backgroundColor: bgColor(koma), userSelect: 'none' }} onClick={() => onClick(koma)}>
          {getKomaName1Char(koma, false)} × {mochigoma[koma]}
        </div>
      ))}
  </div>
);

type PropsShogiCellView = { cell: ShogiCell; rotate: boolean; bgColor?: string; onClick: () => unknown; onRightClick: () => unknown };
const ShogiCellView = ({ cell, rotate, bgColor, onClick, onRightClick }: PropsShogiCellView) => (
  <div
    style={{
      width: `${shogiCellSizePx}px`,
      height: `${shogiCellSizePx}px`,
      textAlign: 'center',
      lineHeight: `${shogiCellSizePx}px`,
      border: '1px solid',
      backgroundColor: bgColor,
      transform: rotate ? 'rotate(180deg)' : undefined,
      userSelect: 'none',
    }}
    onClick={() => onClick()}
    onContextMenu={(e) => {
      e.preventDefault();
      onRightClick();
    }}
  >
    {cell ? getKomaName1Char(cell.koma, cell.nari) : ''}
  </div>
);
