import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const usuario = {
    nome: user?.nomUsuario || 'Usuário',
    matricula: user?.codUsuarioCPF || '—',
    saldo: 45.60,
    refeicoes: 8,
    ultimaRefeicao: '12/01/2024 - 12:30'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Boas-vindas */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-l-4 border-blue-900 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Olá, {usuario.nome}!</h1>
            <p className="text-gray-600 mt-1">Matrícula: {usuario.matricula}</p>
          </div>
          <div className="text-4xl">👋</div>
        </div>

        {/* Cards de Informação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Card de Saldo */}
          <div 
            onClick={() => navigate('/credito')}
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Saldo Disponível</h3>
              <span className="text-3xl transform group-hover:scale-110 transition-transform">💰</span>
            </div>
            <p className="text-4xl font-bold text-blue-900">
              R$ {usuario.saldo.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Toque para recarregar</p>
          </div>

          {/* Card de Refeições */}
          <div 
            onClick={() => navigate('/cardapio')}
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Refeições Restantes</h3>
              <span className="text-3xl transform group-hover:scale-110 transition-transform">🍽️</span>
            </div>
            <p className="text-4xl font-bold text-blue-900">{usuario.refeicoes}</p>
            <p className="text-sm text-gray-500 mt-2">Última: {usuario.ultimaRefeicao}</p>
          </div>
        </div>

        {/* Cardápio do Dia */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-900">📅 Cardápio de Hoje</h2>
            <button 
              onClick={() => navigate('/cardapio')}
              className="text-blue-900 hover:text-blue-700 text-sm font-semibold hover:underline"
            >
              Ver completo →
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-1">🌞 Almoço</h4>
              <p className="text-gray-700 text-sm">Arroz, Feijão, Frango Grelhado, Salada de Folhas</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-1">🌙 Jantar</h4>
              <p className="text-gray-700 text-sm">Sopa de Legumes, Pão Integral, Ovos Mexidos</p>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/credito')}
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-md"
          >
            💳 Recarregar
          </button>
          <button 
            onClick={() => navigate('/cardapio')}
            className="bg-white hover:bg-gray-50 text-blue-900 font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-md border-2 border-blue-900"
          >
            🗓️ Cardápio
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;