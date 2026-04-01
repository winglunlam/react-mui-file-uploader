import { createTheme, ThemeOptions } from '@mui/material/styles';

export const createUploaderTheme = (options: ThemeOptions = {}) => {
  return createTheme({
    ...options,
  });
};

export const defaultUploaderTheme = createUploaderTheme();
