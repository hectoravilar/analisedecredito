import { createTheme } from '@mui/material/styles';

// Função para criar tema personalizado
export const createCustomTheme = (options = {}) => {
  const {
    primaryColor = '#1976d2',
    secondaryColor = '#f50057',
    fontFamily = '"Roboto", "Helvetica", "Arial", sans-serif',
    borderRadius = 8,
    isDarkMode = false
  } = options;

  return createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: primaryColor,
        light: isDarkMode ? '#4dabf5' : '#42a5f5',
        dark: isDarkMode ? '#1565c0' : '#1565c0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: secondaryColor,
        light: isDarkMode ? '#f73378' : '#ff4081',
        dark: isDarkMode ? '#ab003c' : '#c51162',
        contrastText: '#ffffff',
      },
      background: {
        default: isDarkMode ? '#121212' : '#f5f5f5',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
      success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
      },
      warning: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
      },
      error: {
        main: '#f44336',
        light: '#e57373',
        dark: '#d32f2f',
      },
      info: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
      },
    },
    typography: {
      fontFamily,
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        letterSpacing: '-0.00833em',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        letterSpacing: '0em',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        letterSpacing: '0.00735em',
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        letterSpacing: '0em',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        letterSpacing: '0.0075em',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius * 3,
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
            boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: isDarkMode ? '0 6px 12px rgba(0, 0, 0, 0.5)' : '0 6px 12px rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius * 1.5,
            boxShadow: isDarkMode 
              ? '0 8px 16px rgba(0, 0, 0, 0.4)' 
              : '0 8px 16px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isDarkMode 
                ? '0 12px 24px rgba(0, 0, 0, 0.5)' 
                : '0 12px 24px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius * 1.5,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: borderRadius,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: primaryColor,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: borderRadius * 2,
          },
        },
      },
    },
  });
};

// Exemplos de temas pré-configurados
export const themes = {
  default: createCustomTheme(),
  
  dark: createCustomTheme({
    isDarkMode: true
  }),
  
  modern: createCustomTheme({
    primaryColor: '#3f51b5',
    secondaryColor: '#00bcd4',
    borderRadius: 8
  }),
  
  elegant: createCustomTheme({
    primaryColor: '#212121',
    secondaryColor: '#757575',
    fontFamily: '"Playfair Display", serif',
    borderRadius: 2
  }),
  
  vibrant: createCustomTheme({
    primaryColor: '#ff5722',
    secondaryColor: '#ffc107',
    borderRadius: 16
  }),
  
  corporate: createCustomTheme({
    primaryColor: '#0277bd',
    secondaryColor: '#26a69a',
    fontFamily: '"Montserrat", sans-serif',
    borderRadius: 4
  }),
  
  luxury: createCustomTheme({
    primaryColor: '#8e24aa',
    secondaryColor: '#d4af37',
    fontFamily: '"Cormorant Garamond", serif',
    borderRadius: 0
  }),
  
  // Novos temas adicionados
  carDealer: createCustomTheme({
    primaryColor: '#1e88e5',
    secondaryColor: '#ff6d00',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    borderRadius: 12
  }),
  
  finance: createCustomTheme({
    primaryColor: '#00695c',
    secondaryColor: '#ffc400',
    fontFamily: '"Montserrat", sans-serif',
    borderRadius: 8
  }),
  
  premium: createCustomTheme({
    primaryColor: '#283593',
    secondaryColor: '#d84315',
    fontFamily: '"Poppins", sans-serif',
    borderRadius: 10
  })
};

export default createCustomTheme;