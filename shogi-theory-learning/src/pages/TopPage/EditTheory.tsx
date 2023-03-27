import { Button, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { ShogiTheory, ShogiTheoryNode } from '../../domain/ShogiTheory';
import { MoveInputShogiBoardView } from '@charon1212/shogi-ui/build/shogi/MoveInputShogiBoardView';
import { ShogiBoard } from '@charon1212/shogi-domain';
import { MyNode } from 'util-charon1212';
import { ShogiMove } from '@charon1212/shogi-domain/build/domain/ShogiMove';
import { ViewBranch } from './ViewBranch';

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
            <MoveInputShogiBoardView shogiBoard={board} onInputMove={onInputMove} />
            <div style={{ backgroundColor: 'lightcyan', width: '100%', padding: '10px' }}>
              <Button variant='contained' onClick={deleteMove}>
                差し手削除
              </Button>
            </div>
          </div>
          <div style={{ backgroundColor: 'lightcyan', padding: '10px' }}>
            <TextField value={currentNode?.value.comment ?? ''} onChange={(e) => updateSetMoveComment(e.target.value)} multiline fullWidth rows={5} />
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
