import { TextField, TextFieldProps } from '@mui/material';
import { useState } from 'react';

export const useTextField = (init: string, props?: TextFieldProps) => {
  const [state, setState] = useState(init);
  const ui = <TextField {...props} value={state} onChange={(e) => setState(e.target.value)} />;
  return [ui, state, setState] as const;
};
