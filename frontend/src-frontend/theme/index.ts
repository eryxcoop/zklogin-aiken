import { ThemeOptions } from '@mui/material';

const fontFamily = `"Montserrat", sans-serif`;
const ThemeConfig = {
  palette: {
    mode: 'light',
    primary: {
      main: '#0033AD',
      light: '#4D77C9',
      dark: '#001F6B',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f0f5ff',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    allVariants: {
      fontFamily: fontFamily,
      color: '#1a2a4a',
    },
    button: {
      textTransform: 'none',
      whiteSpace: 'nowrap',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        sizeMedium: {
          height: '2.5rem',
        },
        root: {
          fontSize: '0.875rem',
          letterSpacing: '0rem',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeSmall: {
          fontSize: '0.75rem',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontFamily },
      },
    },
  },
} as ThemeOptions;

export default ThemeConfig;
