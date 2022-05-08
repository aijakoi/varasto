import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Tuotteet } from './Tuote';
import Etusivu from './Etusivu';
import Haku from './Haku';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<App />} />
  <Route path="Etusivu" element={<Etusivu />} />
  <Route path="Haku" element={<Haku />} />
      <Route path="Tuote" element={<Tuotteet />} />
  </Routes>

  </BrowserRouter>
);


