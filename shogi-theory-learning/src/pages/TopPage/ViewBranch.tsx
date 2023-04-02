import { ShogiTheoryNode } from '../../domain/ShogiTheory';
import { MyTree, MyNode } from 'util-charon1212';
import { useState } from 'react';
import { getMoveText } from '../../domain/getMoveText';
import { getMoveBoardCountText } from '../../domain/getMoveBoardCountText';

type Props = {
  tree: MyTree<ShogiTheoryNode>;
  current: MyNode<ShogiTheoryNode> | undefined;
  onClickNode?: (node: MyNode<ShogiTheoryNode> | undefined) => unknown;
};
export const ViewBranch = (props: Props) => {
  const { tree, current, onClickNode } = props;
  const [fontSize, setFontSize] = useState(10);

  const list = tree.root ? f(tree.root) : [];

  const list2 = list.map((v) => ({ ...v, childOfCurrent: false }));
  let a: typeof list[number] | undefined = undefined;
  for (let i = 0; i < list2.length; i++) {
    if (a) {
      if (list2[i].indent <= a.indent) break;
      list2[i].childOfCurrent = true;
    } else {
      if (list2[i].nodes.includes(current!)) {
        a = list2[i];
        list2[i].childOfCurrent = true;
      }
    }
  }

  return (
    <>
      <div>
        文字サイズ：{`${fontSize}`}
        <a
          style={{ margin: '0 10px 0', userSelect: 'none' }}
          href='#'
          onClick={(e) => {
            e.preventDefault();
            setFontSize(fontSize - 1);
          }}
        >
          小
        </a>
        <a
          style={{ margin: '0 10px 0', userSelect: 'none' }}
          href='#'
          onClick={(e) => {
            e.preventDefault();
            setFontSize(fontSize + 1);
          }}
        >
          大
        </a>
      </div>
      <div style={{ fontSize }}>
        <div>
          <a href='#' onClick={() => onClickNode?.(undefined)} style={{ backgroundColor: current === undefined ? 'lightcoral' : '' }}>
            初期局面
          </a>
        </div>
        {list2.map(({ indent, nodes, childOfCurrent }) => (
          <div style={{ marginLeft: `${indent * 10}px`, backgroundColor: childOfCurrent ? 'pink' : '' }}>
            {nodes.map((node) => (
              <>
                <a href='#' onClick={() => onClickNode?.(node)} style={{ margin: '0 2px 0', backgroundColor: node === current ? 'lightcoral' : '' }}>
                  {getMoveText(node.value.move, node.parent?.value.move)}
                  {node.value.comment ? '*' : ''}
                  {getMoveBoardCountText(node.value.boardCount, node.value.check)}
                </a>
              </>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

/**
 * 分岐リストを計算する。例えば、次のような木構造のとき
 *
 * ```
 * A - B - C - D - E
 *               - F
 *       - G - H - I
 * ```
 *
 * 次のような配列を返却する。
 * ```
 * [
 *   {indent: 0, nodes: [A, B]},
 *     {indent: 1, nodes: [C, D]},
 *       {indent: 2, nodes: [E]},
 *       {indent: 2, nodes: [F]},
 *     {indent: 1, nodes: [G, H, I]},
 * ]
 * ```
 *
 * @param node
 * @returns
 */
const f = (node: MyNode<ShogiTheoryNode>): { indent: number; nodes: MyNode<ShogiTheoryNode>[] }[] => {
  if (node.children.length === 0) return [{ indent: 0, nodes: [node] }];
  if (node.children.length === 1) {
    const childList = f(node.children[0]);
    childList[0].nodes = [node, ...childList[0].nodes];
    return childList;
  } else {
    return [
      { indent: 0, nodes: [node] },
      ...node.children
        .flatMap((child) => f(child))
        .map((v) => {
          v.indent++;
          return v;
        }),
    ];
  }
};
