import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/home', label: '🏠 Início' },
    { path: '/cardapio', label: '🍽️ Cardápio' },
    { path: '/credito', label: '💳 Créditos' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🍽️</span>
            <h1 className="text-xl font-bold text-blue-900 hidden sm:block">
              Meu Bandeco
            </h1>
          </div>

          {/* Navegação */}
          <nav className="flex space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-blue-900 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Ícone de Logout */}
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Sair"
          >
            🚪
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;