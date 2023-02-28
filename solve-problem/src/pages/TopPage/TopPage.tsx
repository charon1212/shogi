import { CreateProblemSetPage } from '../CreateProblemSetPage/CreateProblemSetPage';
import { ProblemListPage } from '../ProblemListPage/ProblemListPage';
import { TestPage } from '../TestPage';
import { useHeader } from './useHeader';

export const TopPage = () => {
  const [header, pageId] = useHeader();

  return (
    <>
      {header}
      {pageId === 'ProblemListPage' ? <ProblemListPage /> : ''}
      {pageId === 'CreateProblemSetPage' ? <CreateProblemSetPage /> : ''}
      {pageId === 'TestPage' ? <TestPage /> : ''}
    </>
  );
};
