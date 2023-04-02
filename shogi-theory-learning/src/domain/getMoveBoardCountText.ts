export const getMoveBoardCountText = (boardCount: string, check: boolean) =>
  boardCount || check ? `[${check ? '★' : ''}${boardCount ? `${boardCount}図` : ''}]` : '';
