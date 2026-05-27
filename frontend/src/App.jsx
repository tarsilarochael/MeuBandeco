import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CardapioPage from './pages/CardapioPage';
import CreditoPage from './pages/CreditoPage';
import PainelNutriPage from './pages/PainelNutriPage';
import { useAuth, PAPEL_NUTRICIONISTA } from './context/AuthContext.jsx';
import './App.css';

function FullScreenLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-900 font-semibold">
      Carregando…
    </div>
  );
}

function RequireAuth({ children }) {
  const { user, ready } = useAuth();

  if (!ready) return <FullScreenLoading />;
  if (!user) return <Navigate to="/" replace />;

  return children;
}

function RequireNutricionista({ children }) {
  const { user, ready } = useAuth();

  if (!ready) return <FullScreenLoading />;
  if (!user) return <Navigate to="/" replace />;
  if (user.idPapel !== PAPEL_NUTRICIONISTA) return <Navigate to="/home" replace />;

  return children;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/Login" element={<LoginPage />} />
    <Route
      path="/home"
      element={
        <RequireAuth>
          <HomePage />
        </RequireAuth>
      }
    />
    <Route
      path="/cardapio"
      element={
        <RequireAuth>
          <CardapioPage />
        </RequireAuth>
      }
    />
    <Route
      path="/credito"
      element={
        <RequireAuth>
          <CreditoPage />
        </RequireAuth>
      }
    />
    <Route
      path="/nutricionista"
      element={
        <RequireNutricionista>
          <PainelNutriPage />
        </RequireNutricionista>
      }
    />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
