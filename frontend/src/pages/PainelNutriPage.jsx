import React, { useState } from 'react';
import Header from '../components/Header';

const PainelNutriPage = () => {
  const [abaAtiva, setAbaAtiva] = useState('feedbacks'); // Mudei para iniciar em feedbacks para testarmos o dash

  // Mock de dados para os feedbacks
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      aluno: 'João Silva',
      data: '15/01/2024',
      nota: 4,
      comentario: 'A comida estava ótima, mas a fila estava muito grande hoje.',
    },
    {
      id: 2,
      aluno: 'Maria Souza',
      data: '16/01/2024',
      nota: 5,
      comentario: 'O estrogonofe de soja estava maravilhoso! Por favor, façam mais vezes.',
    }
  ]);

  const [novaResposta, setNovaResposta] = useState('');

  // --- CÁLCULOS DO DASHBOARD ---
  const totalAvaliacoes = feedbacks.length;
  const mediaNotas = totalAvaliacoes > 0 
    ? (feedbacks.reduce((acc, curr) => acc + curr.nota, 0) / totalAvaliacoes).toFixed(1) 
    : 0;
  const pendentesResposta = feedbacks.filter(f => !f.resposta).length;

  const responderFeedback = (id) => {
    if (!novaResposta) return;
    setFeedbacks(feedbacks.map(f => 
      f.id === id ? { ...f, resposta: novaResposta } : f
    ));
    setNovaResposta('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Cabeçalho do Painel */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-l-4 border-green-600 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">👩‍⚕️ Painel da Nutricionista</h1>
            <p className="text-gray-500 mt-1">Gestão de Refeitórios • CEFET-MG</p>
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
            Acesso Administrativo
          </div>
        </div>

        {/* Menu de Abas */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setAbaAtiva('cardapio')}
            className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              abaAtiva === 'cardapio' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-blue-50'
            }`}
          >
            📋 Gerenciar Cardápio Base
          </button>
          <button
            onClick={() => setAbaAtiva('comunicados')}
            className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              abaAtiva === 'comunicados' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-blue-50'
            }`}
          >
            📢 Comunicados
          </button>
          <button
            onClick={() => setAbaAtiva('feedbacks')}
            className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              abaAtiva === 'feedbacks' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-blue-50'
            }`}
          >
            ⭐ Avaliações dos Alunos
          </button>
        </div>

        {/* CONTEÚDO DAS ABAS */}
        
        {/* Aba: Cardápio Base */}
        {abaAtiva === 'cardapio' && (
          <div className="bg-white rounded-2xl shadow-md p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Definir Cardápio do Dia</h2>
            {/* ... restante do seu código do cardápio ... */}
          </div>
        )}

        {/* Aba: Comunicados */}
        {abaAtiva === 'comunicados' && (
          <div className="bg-white rounded-2xl shadow-md p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Novo Comunicado</h2>
            {/* ... restante do seu código de comunicados ... */}
          </div>
        )}

        {/* Aba: Feedbacks (Com o novo Dashboard!) */}
        {abaAtiva === 'feedbacks' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Seção do Dashboard / Resumo da Semana */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <span className="text-sm font-medium text-gray-500">Avaliações na Semana</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-gray-800">{totalAvaliacoes}</span>
                  <span className="text-xs text-green-600 font-semibold">+12% vs última sem.</span>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <span className="text-sm font-medium text-gray-500">Média de Satisfação</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-gray-800">{mediaNotas}</span>
                  <span className="text-yellow-500 text-lg">{'★'.repeat(Math.round(mediaNotas))}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <span className="text-sm font-medium text-gray-500">Respostas Pendentes</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-red-600">{pendentesResposta}</span>
                  <span className="text-xs text-gray-400">precisam de atenção</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-blue-900 mb-2">Avaliações Pendentes e Respondidas</h2>
            
            {feedbacks.map((fb) => (
              <div key={fb.id} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-gray-800">{fb.aluno}</p>
                    <p className="text-sm text-gray-500">{fb.data}</p>
                  </div>
                  <div className="text-yellow-500 text-lg">
                    {'★'.repeat(fb.nota)}{'☆'.repeat(5 - fb.nota)}
                  </div>
                </div>
                
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg mb-4 italic">
                  "{fb.comentario}"
                </p>

                {fb.resposta ? (
                  <div className="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-r-lg">
                    <p className="text-sm font-bold text-blue-900 mb-1">Sua resposta oficial:</p>
                    <p className="text-gray-800">{fb.resposta}</p>
                    <p className="text-xs text-gray-500 mt-2">🔒 Avaliação já respondida (RN06).</p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Escreva uma resposta oficial..." 
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-800 bg-white"
                      onChange={(e) => setNovaResposta(e.target.value)}
                    />
                    <button 
                      onClick={() => responderFeedback(fb.id)}
                      className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      Enviar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default PainelNutriPage;