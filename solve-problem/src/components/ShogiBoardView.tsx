import { getAllShogiKoma, getKomaName, Mochigoma, ShogiBoard, ShogiCell, ShogiKoma } from '../domain/shogi';
import { convertMasuIJToSD, ShogiMasu, ShogiMasuIJ } from '../domain/shogiZahyo';
import { transpose } from '../util/transpose';

const shogiCellSizePx = 30;

type Props = {
  board: ShogiBoard;
  colorBoard?: { masu: ShogiMasu; color: string }[];
  colorMochigoma?: { sente: boolean; koma: ShogiKoma; color: string }[];
  onClickBoard?: (masu: ShogiMasu) => unknown;
  onClickMochigoma?: (koma: ShogiKoma, sente: boolean) => unknown;
  onRightClickBoard?: (masu: ShogiMasu) => unknown;
  onRightClickMochigoma?: (koma: ShogiKoma, sente: boolean) => unknown;
  allowMochigomaKing?: boolean;
};
export const ShogiBoardView = (props: Props) => {
  const { board, colorBoard, colorMochigoma, onClickBoard, onClickMochigoma, onRightClickBoard, onRightClickMochigoma, allowMochigomaKing } = props;
  const drawBoard = transpose(board.board).map((v) => [...v].reverse());
  const getColor = (masu: ShogiMasuIJ) => {
    const { s, d } = convertMasuIJToSD(masu);
    return colorBoard?.find((c) => c.masu.s === s && c.masu.d === d)?.color ?? '';
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          <MochigomaView
            title='後手'
            mochigoma={board.mochigoma.gote}
            bgColor={(koma) => colorMochigoma?.find((v) => !v.sente && v.koma === koma)?.color}
            onClick={(koma) => onClickMochigoma?.(koma, false)}
            onRightClick={(koma) => onRightClickMochigoma?.(koma, false)}
            allowMochigomaKing={allowMochigomaKing ?? false}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: `${9 * (shogiCellSizePx + 2)}px`, border: '1px solid' }}>
          {drawBoard.map((v, i) => (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {v.map((w, j) => (
                <ShogiCellView
                  cell={w}
                  bgColor={getColor({ i, j })}
                  onClick={() => onClickBoard?.(convertMasuIJToSD({ i, j }))}
                  onRightClick={() => onRightClickBoard?.(convertMasuIJToSD({ i, j }))}
                />
              ))}
            </div>
          ))}
        </div>
        <div>
          <MochigomaView
            title='先手'
            mochigoma={board.mochigoma.sente}
            bgColor={(koma) => colorMochigoma?.find((v) => v.sente && v.koma === koma)?.color}
            onClick={(koma) => onClickMochigoma?.(koma, true)}
            onRightClick={(koma) => onRightClickMochigoma?.(koma, true)}
            allowMochigomaKing={allowMochigomaKing ?? false}
          />
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
  <div style={{ margin: '10px' }}>
    <div>{title}</div>
    {getAllShogiKoma()
      .filter((v) => allowMochigomaKing || v !== 'k')
      .map((koma) => (
        <div style={{ backgroundColor: bgColor(koma), userSelect: 'none' }} onClick={() => onClick(koma)}>
          {getKomaName(koma, false)} × {mochigoma[koma]}
        </div>
      ))}
  </div>
);

type PropsShogiCellView = { cell: ShogiCell; bgColor?: string; onClick: () => unknown; onRightClick: () => unknown };
const ShogiCellView = ({ cell, bgColor, onClick, onRightClick }: PropsShogiCellView) => (
  <div
    style={{
      width: `${shogiCellSizePx}px`,
      height: `${shogiCellSizePx}px`,
      textAlign: 'center',
      lineHeight: `${shogiCellSizePx}px`,
      border: '1px solid',
      backgroundColor: bgColor,
      transform: cell?.sente === false ? 'rotate(180deg)' : undefined,
      userSelect: 'none',
    }}
    onClick={() => onClick()}
    onContextMenu={(e) => {
      e.preventDefault();
      onRightClick();
    }}
  >
    {cell ? getKomaName(cell.koma, cell.nari) : ''}
  </div>
);
