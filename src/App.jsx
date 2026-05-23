import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CardapioPage from './pages/CardapioPage';
import CreditoPage from './pages/CreditoPage';
import PainelNutriPage from './pages/PainelNutriPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/cardapio" element={<CardapioPage />} />
        <Route path="/credito" element={<CreditoPage />} />
        <Route path="/nutricionista" element={<PainelNutriPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;