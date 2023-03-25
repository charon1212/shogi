import { useState } from 'react';
import { SimpleSelectList } from '@charon1212/my-lib-react';
import { ShogiProblemSet, ShogiProblemUnit } from '../../domain/problem';
import { Button } from '@mui/material';
import { createShogiBoardInit } from '../../domain/shogiBoardTemplate';
import { EditProblemUnit } from './EditProblemUnit';

type Props = { problemSet: ShogiProblemSet; setProblemSet: (problemSet: ShogiProblemSet) => unknown };
export const EditProblemSet = (props: Props) => {
  const { problemSet, setProblemSet } = props;
  const [indexProblemUnit, setIndexProblemUnit] = useState<number | undefined>(undefined);
  const onAddProblemUnit = () => {
    const newProblemUnit: ShogiProblemUnit = { origin: createShogiBoardInit(), problems: [] };
    setProblemSet({ ...problemSet, problemUnits: [...problemSet.problemUnits, newProblemUnit] });
  };
  const selectedProblemUnit = indexProblemUnit === undefined ? undefined : problemSet.problemUnits[indexProblemUnit];
  const setProblemUnit = (problemUnit: ShogiProblemUnit) => {
    if (indexProblemUnit !== undefined && indexProblemUnit >= 0 && indexProblemUnit < problemSet.problemUnits.length) {
      const newProblemUnits = [...problemSet.problemUnits];
      newProblemUnits[indexProblemUnit] = problemUnit;
      setProblemSet({ ...problemSet, problemUnits: newProblemUnits });
    }
  };

  return (
    <>
      <div style={{ display: 'flex', margin: '10px' }}>
        <div style={{ width: '200px' }}>
          <Button onClick={onAddProblemUnit}>新規追加</Button>
          <SimpleSelectList
            list={problemSet.problemUnits.map((problemUnit, index) => ({ problemUnit, index }))}
            content={({ problemUnit, index }) => (
              <>
                {index + 1} - {problemUnit.problems.length}問
              </>
            )}
            selected={({ index }) => index === indexProblemUnit}
            onClick={({ index }) => setIndexProblemUnit(index)}
            sx={{ listItem: { padding: 0 } }}
          />
        </div>
        <div>{selectedProblemUnit !== undefined ? <EditProblemUnit problemUnit={selectedProblemUnit} setProblemUnit={setProblemUnit} /> : ''}</div>
      </div>
    </>
  );
};
