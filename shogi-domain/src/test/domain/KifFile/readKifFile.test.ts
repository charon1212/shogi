import * as fs from 'fs';
import { readKifFile } from '../../../index';
import { assertShogiMove } from '../assertion';
import { createShogiMove } from '../testUtil';

describe('KifFile.readKifFile', () => {
  it('test1', () => {
    // ■ prepare
    const test1File = fs.readFileSync('src/test/domain/KifFile/test1.kif').toString();
    // ■ action
    const { shogiKifu } = readKifFile(test1File);
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
    assertShogiMove(createShogiMove('sp 77>76'), node1!.value.move);
    assertShogiMove(createShogiMove('gp 33>34'), node2!.value.move);
    assertShogiMove(createShogiMove('sp 27>26'), node3!.value.move);
    assertShogiMove(createShogiMove('gp 43>44'), node4!.value.move);
    assertShogiMove(createShogiMove('ss 39>48'), node5!.value.move);
    assertShogiMove(createShogiMove('gs 31>32'), node6!.value.move);
    assertShogiMove(createShogiMove('sk 59>68'), node7!.value.move);
    assertShogiMove(createShogiMove('gr 82>42'), node8!.value.move);
    expect(node8!.value.comment).toBe('四間飛車基本図\n');
  });

  it('test2', () => {
    // ■ prepare
    const test1File = fs.readFileSync('src/test/domain/KifFile/test2.kif').toString();
    // ■ action
    const { shogiKifu } = readKifFile(test1File);
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
    const node9 = node8!.children[0];
    const node10 = node9!.children[0];
    const node11 = node10!.children[0];
    const node12 = node11!.children[0];
    const node13 = node12!.children[0];
    const node14 = node13!.children[0];
    const node15 = node14!.children[0];
    assertShogiMove(createShogiMove('sp 77>76'), node1!.value.move);
    assertShogiMove(createShogiMove('gp 33>34'), node2!.value.move);
    assertShogiMove(createShogiMove('sp 27>26'), node3!.value.move);
    assertShogiMove(createShogiMove('gp 83>84'), node4!.value.move);
    assertShogiMove(createShogiMove('sp 26>25'), node5!.value.move);
    assertShogiMove(createShogiMove('gp 84>85'), node6!.value.move);
    assertShogiMove(createShogiMove('sg 69>78'), node7!.value.move);
    assertShogiMove(createShogiMove('gg 41>32'), node8!.value.move);
    assertShogiMove(createShogiMove('sp 25>24'), node9!.value.move);
    assertShogiMove(createShogiMove('gp 23>24'), node10!.value.move);
    assertShogiMove(createShogiMove('sr 28>24'), node11!.value.move);
    assertShogiMove(createShogiMove('gp 85>86'), node12!.value.move);
    assertShogiMove(createShogiMove('sp 87>86'), node13!.value.move);
    assertShogiMove(createShogiMove('gr 82>86'), node14!.value.move);
    assertShogiMove(createShogiMove('sr 24>34'), node15!.value.move);

    // ３三角型の分岐
    const node16_1 = node15!.children[0];
    const node17_1 = node16_1!.children[0];
    const node18_1 = node17_1!.children[0];
    const node19_1 = node18_1!.children[0];
    const node20_1 = node19_1!.children[0];
    const node21_1 = node20_1!.children[0];
    assertShogiMove(createShogiMove('gb 22>33'), node16_1!.value.move);
    assertShogiMove(createShogiMove('sr 34>36'), node17_1!.value.move);
    assertShogiMove(createShogiMove('gr 86>84'), node18_1!.value.move);
    assertShogiMove(createShogiMove('sr 36>26'), node19_1!.value.move);
    assertShogiMove(createShogiMove('gs 31>22'), node20_1!.value.move);
    assertShogiMove(createShogiMove('sp   >87'), node21_1!.value.move);
    expect(node21_1!.value.comment).toBe('３三角\n');

    // ４五角型の分岐
    const node16_2 = node15!.children[1];
    const node17_2 = node16_2!.children[0];
    const node18_2 = node17_2!.children[0];
    const node19_2 = node18_2!.children[0];
    const node20_2 = node19_2!.children[0];
    const node21_2 = node20_2!.children[0];
    const node22_2 = node21_2!.children[0];
    const node23_2 = node22_2!.children[0];
    const node24_2 = node23_2!.children[0];
    const node25_2 = node24_2!.children[0];
    const node26_2 = node25_2!.children[0];
    const node27_2 = node26_2!.children[0];
    const node28_2 = node27_2!.children[0];
    assertShogiMove(createShogiMove('gb 22>88!'), node16_2!.value.move);
    assertShogiMove(createShogiMove('ss 79>88'), node17_2!.value.move);
    assertShogiMove(createShogiMove('gp   >28'), node18_2!.value.move);
    assertShogiMove(createShogiMove('ss 39>28'), node19_2!.value.move);
    assertShogiMove(createShogiMove('gb   >45'), node20_2!.value.move);
    assertShogiMove(createShogiMove('sr 34>24'), node21_2!.value.move);
    assertShogiMove(createShogiMove('gp   >23'), node22_2!.value.move);
    assertShogiMove(createShogiMove('sb   >77'), node23_2!.value.move);
    assertShogiMove(createShogiMove('gr 86>88!'), node24_2!.value.move);
    assertShogiMove(createShogiMove('sb 77>88'), node25_2!.value.move);
    assertShogiMove(createShogiMove('gp 23>24'), node26_2!.value.move);
    assertShogiMove(createShogiMove('sb 88>11!'), node27_2!.value.move);
    assertShogiMove(createShogiMove('gn 21>33'), node28_2!.value.move);
    expect(node20_2!.value.comment).toBe('４五角\n');

    // ４五角型に２四飛の前で７七角の変化
    const node21_3 = node20_2!.children[1];
    const node22_3 = node21_3!.children[0];
    const node23_3 = node22_3!.children[0];
    const node24_3 = node23_3!.children[0];
    const node25_3 = node24_3!.children[0];
    const node26_3 = node25_3!.children[0];
    assertShogiMove(createShogiMove('sb   >77'), node21_3!.value.move);
    assertShogiMove(createShogiMove('gr 86>88!'), node22_3!.value.move);
    assertShogiMove(createShogiMove('sb 77>88'), node23_3!.value.move);
    assertShogiMove(createShogiMove('gb 45>34'), node24_3!.value.move);
    assertShogiMove(createShogiMove('sb 88>11!'), node25_3!.value.move);
    assertShogiMove(createShogiMove('gn 21>33'), node26_3!.value.move);

  });
});
