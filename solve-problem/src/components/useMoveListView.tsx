import { useState, useEffect } from 'react';
import { ShogiMove } from '../domain/shogi';
import { useScroll } from '@charon1212/my-lib-react';

export type UseMoveListViewArgs = { moveList: ShogiMove[] };
export const useMoveListView = ({ moveList }: UseMoveListViewArgs) => {
  const [moveCount, setMoveCount] = useState(0);
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

  const ui = (
    <>
      <div style={{ overflowY: 'auto' }}>
        <div {...createMoveDivProps(0)}>0 - 開始局面</div>
        {moveList.map((move, i) => (
          <div {...createMoveDivProps(i + 1)}>
            {i + 1} - {move.text}
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
  return [ui, moveCount, setMoveCount] as const;
};
