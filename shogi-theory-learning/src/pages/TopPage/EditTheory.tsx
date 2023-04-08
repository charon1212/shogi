import { Button, TextField, Checkbox, FormGroup, FormControlLabel, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { ShogiTheory, ShogiTheoryNode } from '../../domain/ShogiTheory';
import { MoveInputShogiBoardView } from '@charon1212/shogi-ui/build/shogi/MoveInputShogiBoardView';
import { ShogiBoard } from '@charon1212/shogi-domain';
import { MyNode } from 'util-charon1212';
import { ShogiMove } from '@charon1212/shogi-domain/build/domain/ShogiMove';
import { ViewBranch } from './ViewBranch';
import { getMoveText } from '../../domain/getMoveText';
import { getMoveBoardCountText } from '../../domain/getMoveBoardCountText';

const equalMove = (m1: ShogiMove, m2: ShogiMove): boolean => {
  if (m1.sente !== m2.sente) return false;
  if (m1.after.d !== m2.after.d) return false;
  if (m1.after.s !== m2.after.s) return false;
  if (m1.uchi && m2.uchi) return m1.koma === m2.koma;
  if (!m1.uchi && !m2.uchi) return m1.before.d === m2.before.d && m1.before.s === m2.before.s && m1.nari === m2.nari;
  return false;
};

type Props = { shogiTheory: ShogiTheory; saveTheory?: (shogiTheory: ShogiTheory) => void };
export const EditTheory = (props: Props) => {
  const { shogiTheory, saveTheory } = props;

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [theory, setTheory] = useState(shogiTheory.theory);
  useEffect(() => {
    setTitle(shogiTheory.title);
    setSummary(shogiTheory.summary);
    setTheory(shogiTheory.theory);
  }, [shogiTheory]);

  const [currentNode, setCurrentNode] = useState<MyNode<ShogiTheoryNode> | undefined>();
  const updateSetMoveComment = (comment: string) => {
    if (currentNode) currentNode.value.comment = comment;
    setTheory(theory.clone());
  };
  const updateBoardCount = (boardCount: string) => {
    if (currentNode) currentNode.value.boardCount = boardCount;
    setTheory(theory.clone());
  };
  const updateCheck = (check: boolean) => {
    if (currentNode) currentNode.value.check = check;
    setTheory(theory.clone());
  };
  const lastMove = currentNode?.value.move;

  const board = (currentNode?.getPath() ?? []).reduce((p, c) => p.adaptShogiMove(c.value.move), new ShogiBoard());
  const onInputMove = (move: ShogiMove) => {
    // 既に入力した差し手が登録済みの場合、新規作成せずそこに遷移する。
    const existNode = currentNode && currentNode.children.find((v) => equalMove(v.value.move, move));
    if (existNode) return setCurrentNode(existNode);
    // ■ Treeの仕様上、初期局面のみ分岐不可とする。これは、TreeのNodeを局面ではなく差し手で表現している弊害。
    if (!currentNode && theory.root) return alert('初期局面のみ、分岐作成不可です。。。改修予定。');
    const newShogiTheoryNode: ShogiTheoryNode = { move, boardCount: '', comment: '', check: false };
    if (currentNode) setCurrentNode(currentNode.addChild(newShogiTheoryNode));
    else {
      theory.setRoot(newShogiTheoryNode);
      setCurrentNode(theory.root);
    }
  };

  const deleteMove = () => {
    if (currentNode) {
      if (currentNode.parent) {
        if (!window.confirm('差し手を削除すると、その先の分岐全てを削除します。よろしいですか？')) return;
        currentNode.parent.removeChild(currentNode);
        setCurrentNode(currentNode.parent);
      } else {
        alert('未実装: util-charon1212/MyTree.setRootにundefinedを指定できるよう修正すればいける。');
      }
    }
  };

  const showSubShogiBoard = () => {
    window.myAPI.showSubShogiBoard(currentNode?.getPath().map((v) => v.value.move) ?? []);
  };

  const createMoveButton = (node: MyNode<ShogiTheoryNode>) => (
    <div>
      <Link style={{ margin: '5px' }} href='#' onClick={() => setCurrentNode(node)}>
        {getMoveText(node.value.move, node.parent?.value.move)}
        {node.value.comment ? '*' : ''}
        {getMoveBoardCountText(node.value.boardCount, node.value.check)}
      </Link>
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ flexShrink: 0, width: '40vw' }}>
          <div style={{ padding: '30px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ width: '100px' }}>タイトル</Typography>
            <TextField fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
            <Button onClick={() => saveTheory?.({ title, summary, theory })}>保存</Button>
          </div>
          <div style={{ display: 'flex' }}>
            <div>
              <Typography variant='h5' sx={{ margin: '5px 20px 5px' }}>
                {currentNode
                  ? `${currentNode.getPath().length}手目 - ${getMoveText(currentNode.value.move, currentNode.parent?.value.move)}`
                  : `0手目 - 初期局面`}
              </Typography>
              <MoveInputShogiBoardView
                shogiBoard={board}
                onInputMove={onInputMove}
                colorBoard={lastMove ? [{ masu: lastMove.after, color: 'lightcoral' }] : []}
              />
            </div>
            <div style={{ backgroundColor: 'lightcyan', width: '100%', padding: '10px' }}>
              <div>
                <Button style={{ margin: '5px' }} variant='contained' onClick={deleteMove}>
                  差し手削除
                </Button>
                <Button style={{ margin: '5px' }} variant='contained' onClick={showSubShogiBoard}>
                  継ぎ盤
                </Button>
              </div>
              <div>
                1手戻る
                {currentNode?.parent !== undefined ? createMoveButton(currentNode?.parent) : ''}
              </div>
              <div>
                1手進む
                <div>{currentNode?.children.map((child) => createMoveButton(child)) ?? ''}</div>
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: '', padding: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', margin: '5px' }}>
              <TextField
                value={currentNode?.value.boardCount ?? ''}
                variant='standard'
                onChange={(e) => updateBoardCount(e.target.value)}
                disabled={currentNode === undefined}
                inputProps={{ style: { textAlign: 'right' } }}
              />
              図
              <div style={{ margin: '0 10px 0' }}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={currentNode?.value.check ?? false} onChange={(e) => updateCheck(e.target.checked)} />}
                    label='Point'
                  />
                </FormGroup>
              </div>
            </div>
            <div>
              <TextField
                value={currentNode?.value.comment ?? '※初期局面のコメントは設定できません'}
                onChange={(e) => updateSetMoveComment(e.target.value)}
                disabled={currentNode === undefined}
                multiline
                fullWidth
                rows={5}
              />
            </div>
          </div>
        </div>
        <div style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ margin: '10px', maxHeight: '100%', overflowY: 'scroll' }}>
            <ViewBranch tree={theory} current={currentNode} onClickNode={(node) => setCurrentNode(node)} />
          </div>
        </div>
      </div>
    </>
  );
};
