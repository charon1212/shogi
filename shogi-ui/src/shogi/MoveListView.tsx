import { useEffect } from 'react';
import { getMasuText, ShogiMove, getKomaName1Char } from '@charon1212/shogi-domain';
import { useScroll } from '@charon1212/my-lib-react';

const createMoveTest = (move: ShogiMove) =>
  `${move.sente ? '▲' : '△'}${getMasuText(move.after)}${getKomaName1Char(move.koma, !move.uchi && move.narikoma)}`;

export type MoveListViewProps = { moveList: ShogiMove[]; moveCount: number; setMoveCount: (moveCount: number) => unknown };
export const MoveListView = (props: MoveListViewProps) => {
  const { moveList, moveCount, setMoveCount } = props;
  const [refScroll, scrollTo] = useScroll();

  useEffect(() => {
    scrollTo();
  }, [moveCount]);

  const createMoveDivProps = (index: number) =>
    ({
      style: { margin: '5px', backgroundColor: index === moveCount ? 'lightcoral' : '', userSelect: 'none' },
      ref: index === moveCount ? refScroll : undefined,
      onClick: () => setMoveCount(index),
    } as const);

  return (
    <>
      <div style={{ overflowY: 'auto' }}>
        <div {...createMoveDivProps(0)}>0 - 開始局面</div>
        {moveList.map((move, i) => (
          <div {...createMoveDivProps(i + 1)} key={i}>
            {i + 1} - {createMoveTest(move)}
          </div>
        ))}
      </div>
      <div style={{ width: '100%' }}>
        <button style={{ width: '50%' }} onClick={() => setMoveCount(Math.max(moveCount - 1, 0))}>
          ＜
        </button>
        <button style={{ width: '50%' }} onClick={() => setMoveCount(Math.min(moveCount + 1, moveList.length))}>
          ＞
        </button>
      </div>
    </>
  );
};
