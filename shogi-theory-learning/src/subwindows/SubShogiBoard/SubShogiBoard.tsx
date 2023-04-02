import { ShogiBoard } from '@charon1212/shogi-domain';
import { MoveInputShogiBoardView } from '@charon1212/shogi-ui';
import { useWindowContext } from '../../context/WindowContext';

export const SubShogiBoard = () => {
  const [windowContext] = useWindowContext();
  const moveList = windowContext?.type === 'sub-shogi-board' ? windowContext.moveList : [];
  const board = moveList.reduce((p, c) => p.adaptShogiMove(c), new ShogiBoard());

  return (
    <>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MoveInputShogiBoardView shogiBoard={board} />
      </div>
    </>
  );
};
