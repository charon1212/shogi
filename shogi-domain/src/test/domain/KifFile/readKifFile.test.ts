import * as fs from 'fs';
import { readKifFile } from '../../../index';
import { assertShogiMove } from '../assertion';
import { createShogiMove } from '../testUtil';

describe('KifFile.readKifFile', () => {
  it('test1', () => {
    // ■ prepare
    const test1File = fs.readFileSync('src/test/domain/KifFile/test1.kif').toString();
    // ■ action
    const { headers, shogiKifu } = readKifFile(test1File);
    // ■ assertion
    const tree1 = shogiKifu.kifu[0];
    expect(tree1).not.toBeUndefined();
    const node1 = tree1.root;
    const node2 = node1!.children[0];
    const node3 = node2!.children[0];
    const node4 = node3!.children[0];
    const node5 = node4!.children[0];
    const node6 = node5!.children[0];
    const node7 = node6!.children[0];
    const node8 = node7!.children[0];
    assertShogiMove(createShogiMove('s77>76'), node1!.value.move);
    assertShogiMove(createShogiMove('g33>34'), node2!.value.move);
    assertShogiMove(createShogiMove('s27>26'), node3!.value.move);
    assertShogiMove(createShogiMove('g43>44'), node4!.value.move);
    assertShogiMove(createShogiMove('s39>48'), node5!.value.move);
    assertShogiMove(createShogiMove('g31>32'), node6!.value.move);
    assertShogiMove(createShogiMove('s59>68'), node7!.value.move);
    assertShogiMove(createShogiMove('g82>42'), node8!.value.move);
    expect(node8!.value.comment).toBe('四間飛車基本図\n');
  });
});
