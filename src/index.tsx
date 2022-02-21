import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeOptions, createTheme, ThemeProvider } from '@mui/material/styles';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { EnvironmentInfo } from './environmentInfo';

// https://stackoverflow.com/questions/49535551/change-primary-and-secondary-colors-in-mui
// customize theme https://bareynol.github.io/mui-theme-creator/#Accordion
export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#ffd500',
    },
    secondary: {
      main: '#ff7903',
    },
  },
};

const theme = createTheme(themeOptions);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {EnvironmentInfo.isDev && 
        <h1 style={{ backgroundColor: "red", width: "100%" }}>DEV: endpoint: {EnvironmentInfo.endpointUri}</h1>}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
