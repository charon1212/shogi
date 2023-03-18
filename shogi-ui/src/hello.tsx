import { Typography } from '@mui/material';

export const hello = (): void => console.log('hello @charon1212/shogi-ui');

export const Hello = ({ text }: { text: string }) => {
  return (
    <div>
      <Typography>Hello @charon1212/shogi-ui</Typography>
      <div>{text}</div>
    </div>
  );
};
