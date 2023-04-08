import { ShogiBoard, ShogiMove } from '@charon1212/shogi-domain';
import { MoveInputShogiBoardView, MoveListView } from '@charon1212/shogi-ui';
import { useWindowContext } from '../../context/WindowContext';
import { useState } from 'react';
import { Button } from '@mui/material';

export const SubShogiBoard = () => {
  const [windowContext] = useWindowContext();
  const initMoveList = windowContext?.type === 'sub-shogi-board' ? windowContext.moveList : [];
  const [moveList, setMoveList] = useState(initMoveList);
  const [moveCount, setMoveCount] = useState(moveList.length);

  const filteredMoveList = moveList.filter((_, i) => i < moveCount);
  const board = filteredMoveList.reduce((p, c) => p.adaptShogiMove(c), new ShogiBoard());

  const lastMove = filteredMoveList.length === 0 ? undefined : filteredMoveList[filteredMoveList.length - 1];
  const colorBoard = lastMove ? [{ masu: lastMove.after, color: 'lightcoral' }] : [];

  const onReset = () => {
    setMoveList(initMoveList);
    setMoveCount(initMoveList.length);
  };
  const onInputMove = (move: ShogiMove) => {
    setMoveList([...filteredMoveList, move]);
    setMoveCount(moveCount + 1);
  };

  const onClickSFENCopy = () => {
    const sfen = board.toSFEN();
    console.log({ sfen });
    window.myAPI.clipboardWrite(sfen);
  };

  return (
    <>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={onReset}>リセット</Button>
            <Button onClick={onClickSFENCopy}>SFENコピー</Button>
          </div>
          <MoveInputShogiBoardView shogiBoard={board} colorBoard={colorBoard} onInputMove={onInputMove} />
        </div>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <MoveListView moveCount={moveCount} moveList={moveList} setMoveCount={setMoveCount} listDivStyle={{ overflowY: 'scroll', margin: '1px' }} />
        </div>
      </div>
    </>
  );
};
