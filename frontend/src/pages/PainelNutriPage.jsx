import React, { useState } from 'react';
import Header from '../components/Header';

const PainelNutriPage = () => {
  const [abaAtiva, setAbaAtiva] = useState('cardapio'); // 'cardapio', 'comunicados', 'feedbacks'

  // Mock de dados para os feedbacks
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      aluno: 'João Silva',
      data: '15/01/2024',
      nota: 4,
      comentario: 'A comida estava ótima, mas a fila estava muito grande hoje.',
      resposta: 'Obrigada pelo feedback, João! Estamos monitorando o tráfego pela catraca para otimizar o fluxo.',
    },
    {
      id: 2,
      aluno: 'Maria Souza',
      data: '16/01/2024',
      nota: 5,
      comentario: 'O estrogonofe de soja estava maravilhoso! Por favor, façam mais vezes.',
      resposta: null, // Ainda sem resposta (RN06)
    }
  ]);

  const [novaResposta, setNovaResposta] = useState('');

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
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              abaAtiva === 'cardapio' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-blue-50'
            }`}
          >
            📋 Gerenciar Cardápio Base
          </button>
          <button
            onClick={() => setAbaAtiva('comunicados')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              abaAtiva === 'comunicados' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-blue-50'
            }`}
          >
            📢 Comunicados
          </button>
          <button
            onClick={() => setAbaAtiva('feedbacks')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              abaAtiva === 'feedbacks' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-blue-50'
            }`}
          >
            ⭐ Avaliações dos Alunos
          </button>
        </div>

        {/* CONTEÚDO DAS ABAS */}
        
        {/* Aba: Cardápio Base (Req11) */}
        {abaAtiva === 'cardapio' && (
          <div className="bg-white rounded-2xl shadow-md p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Definir Cardápio do Dia</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Prato Principal</label>
                  <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-800 bg-gray-50" placeholder="Ex: Frango Assado" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Opção Vegetariana</label>
                  <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-800 bg-gray-50" placeholder="Ex: Estrogonofe de Soja" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Guarnição</label>
                  <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-800 bg-gray-50" placeholder="Ex: Purê de Batatas" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Salada</label>
                  <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-800 bg-gray-50" placeholder="Ex: Mix de Folhas Verdes" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sobremesa</label>
                  <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-800 bg-gray-50" placeholder="Ex: Fruta da Estação" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Replicar para Unidades (Req11):</label>
                  <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-800 bg-gray-50">
                    <option>Todas as Unidades</option>
                    <option>Apenas Campus I e II (BH)</option>
                    <option>Apenas Campus Contagem</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">
              💾 Salvar e Publicar Cardápio Base
            </button>
          </div>
        )}

        {/* Aba: Comunicados (Req10) */}
        {abaAtiva === 'comunicados' && (
          <div className="bg-white rounded-2xl shadow-md p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Novo Comunicado</h2>
            <textarea 
              rows="4" 
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-800 bg-gray-50 mb-4"
              placeholder="Digite o aviso para os alunos (ex: Mudança no horário de funcionamento neste feriado)..."
            ></textarea>
            <button className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">
              📢 Disparar Notificação
            </button>
          </div>
        )}

        {/* Aba: Feedbacks (Req05 e RN06) */}
        {abaAtiva === 'feedbacks' && (
          <div className="space-y-4 animate-fade-in">
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

                {/* Área de Resposta - Aplicação da Regra RN06 (Apenas uma resposta permitida) */}
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