import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Tuotteet } from './Asiakas';
import Etusivu from './Etusivu';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<App />} />
  <Route path="Etusivu" element={<Etusivu />} />
      <Route path="Asiakas" element={<Tuotteet />} />
  </Routes>

  </BrowserRouter>
);


