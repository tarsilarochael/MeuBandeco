import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardapioPreview from './CardapioPreview';
import { useAuth, PAPEL_NUTRICIONISTA } from '../context/AuthContext.jsx';

function resolveIdentificador(raw) {
  return raw.replace(/\D/g, '');
}

const LoginPage = () => {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const [bloqueadoAte, setBloqueadoAte] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const isBloqueado = bloqueadoAte && new Date() < bloqueadoAte;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isBloqueado) {
      const minutosRestantes = Math.ceil((bloqueadoAte - new Date()) / 60000);
      setError(`Usuário bloqueado. Tente novamente em ${minutosRestantes} minutos`);
      return;
    }

    if (!matricula.trim() || !senha.trim()) {
      setError('Matrícula/CPF e senha são obrigatórios');
      return;
    }

    const codUsuarioCPF = resolveIdentificador(matricula);
    if (codUsuarioCPF.length !== 11) {
      setError('Informe um CPF com 11 dígitos.');
      return;
    }

    setIsLoading(true);

    try {
      const usuario = await login(codUsuarioCPF, senha);
      setTentativas(0);

      if (usuario.idPapel === PAPEL_NUTRICIONISTA) {
        navigate('/nutricionista');
      } else {
        navigate('/home');
      }
    } catch (err) {
      const msg = err?.message || 'Erro de conexão. Verifique se o backend está em execução.';
      setError(msg);

      const prox = tentativas + 1;
      setTentativas(prox);
      if (prox >= 5) {
        const bloqueio = new Date();
        bloqueio.setMinutes(bloqueio.getMinutes() + 15);
        setBloqueadoAte(bloqueio);
        setError('Muitas tentativas falhas. Conta temporariamente bloqueada por 15 minutos.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatriculaChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    setMatricula(digits);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border-t-4 border-blue-900 transform transition-all hover:shadow-blue-900/20"
        role="main"
        aria-label="Tela de Login do Meu Bandeco"
      >
        <div className="text-center pt-8 pb-2 px-8">
          <div className="mb-3 text-5xl" aria-hidden="true">🍽️</div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2" style={{ color: '#1a237e' }}>
            Meu Bandeco
          </h1>
          <p className="text-gray-700 text-base">
            CEFET-MG
          </p>
        </div>

        <div className="px-8 mt-6" role="tablist" aria-label="Opções de acesso">
          <div className="flex border-b-2 border-gray-200">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); }}
              role="tab"
              aria-selected={activeTab === 'login'}
              className={`flex-1 py-4 px-4 text-base font-semibold transition-all duration-200 border-b-2 -mb-0.5 ${
                activeTab === 'login' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="flex items-center justify-center gap-2">🔐 ENTRAR</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('cardapio'); setError(''); }}
              role="tab"
              aria-selected={activeTab === 'cardapio'}
              className={`flex-1 py-4 px-4 text-base font-semibold transition-all duration-200 border-b-2 -mb-0.5 ${
                activeTab === 'cardapio' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="flex items-center justify-center gap-2">📅 CARDÁPIO</span>
            </button>
          </div>
        </div>

        <div className="p-8 pt-6">
          {activeTab === 'login' && (
            <div className="animate-fadeIn">
              <p className="text-center text-gray-700 text-base mb-6">
                Use o CPF cadastrado no sistema (demo: senha <strong className="text-blue-900">bandeco123</strong>)
              </p>
              <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto" noValidate>
                <div>
                  <label htmlFor="matricula" className="block text-base font-semibold text-gray-800 mb-2">CPF</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-600">👤</span>
                    <input
                      id="matricula"
                      type="text"
                      inputMode="numeric"
                      maxLength={11}
                      className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none bg-gray-50 text-gray-900"
                      placeholder="00000000000"
                      value={matricula}
                      onChange={handleMatriculaChange}
                      disabled={isLoading || isBloqueado}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="senha" className="block text-base font-semibold text-gray-800 mb-2">Senha</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-600">🔒</span>
                    <input
                      id="senha"
                      type="password"
                      className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none bg-gray-50 text-gray-900"
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => { setSenha(e.target.value); setError(''); }}
                      disabled={isLoading || isBloqueado}
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-100 border-2 border-red-500 text-red-900 px-4 py-3.5 rounded-lg text-base font-medium animate-shake flex items-center gap-3" role="alert">
                    <span>⚠️</span><span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || isBloqueado}
                  className={`w-full font-bold py-4 rounded-lg transition-all transform shadow-lg text-lg ${
                    isLoading || isBloqueado ? 'bg-gray-400' : 'bg-blue-900 hover:bg-blue-800 text-white hover:scale-[1.02]'
                  }`}
                >
                  {isLoading ? 'AUTENTICANDO...' : isBloqueado ? 'BLOQUEADO' : 'ENTRAR'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'cardapio' && (
            <div className="animate-fadeIn">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5 mb-6">
                <p className="font-bold text-blue-900 text-lg">Cardápio público</p>
                <p className="text-base text-blue-800 mt-1">Visualize o cardápio sem login.</p>
              </div>
              <CardapioPreview />
            </div>
          )}
        </div>
      </div>
      <footer className="mt-6 text-center">
        <p className="text-base text-gray-600 uppercase tracking-widest font-semibold">Sistema de Refeitório • CEFET-MG</p>
      </footer>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 90% { transform: translateX(-2px); } 20%, 80% { transform: translateX(2px); } }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default LoginPage;
