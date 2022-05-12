import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Tuotteet } from './Tuote';
import Etusivu from './Etusivu';
import Haku from './Haku';
import { ThemeProvider, createTheme } from '@material-ui/core';
import { CssBaseline } from '@material-ui/core';


const themeGreen = createTheme({
  palette: {
    background: {
      default: "#044302"
    },
    text: {
      primary: "#D8DFDB"

    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={themeGreen}>
    <CssBaseline>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="Etusivu" element={<Etusivu />} />
      <Route path="Haku" element={<Haku />} />
      <Route path="Tuote" element={<Tuotteet />} />
    </Routes>
  </BrowserRouter>
    </CssBaseline>
  </ThemeProvider>

);


