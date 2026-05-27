import React, { useState } from 'react';
import Header from '../components/Header';

const CardapioPage = () => {
  const [diaSelecionado, setDiaSelecionado] = useState('segunda');
  const [unidade, setUnidade] = useState('Campus I - Nova Suíça');
  
  // Estados para o Feedback (Req08)
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [feedbackEnviado, setFeedbackEnviado] = useState(false);

  const cardapioSemanal = {
    segunda: {
      almoco: {
        principal: 'Arroz, Feijão, Bife Acebolado',
        guarnicao: 'Batata Doce Assada',
        salada: 'Alface, Tomate, Cenoura',
        sobremesa: 'Banana',
        suco: 'Laranja'
      },
      jantar: {
        principal: 'Sopa de Legumes com Frango',
        guarnicao: 'Torrada Integral',
        salada: 'Salada de Repolho',
        sobremesa: 'Maçã',
        suco: 'Uva'
      }
    },
    terca: {
      almoco: {
        principal: 'Arroz, Feijão, Filé de Peixe',
        guarnicao: 'Purê de Batata',
        salada: 'Rúcula, Tomate Cereja',
        sobremesa: 'Gelatina',
        suco: 'Maracujá'
      },
      jantar: {
        principal: 'Macarrão ao Sugo',
        guarnicao: 'Legumes Salteados',
        salada: 'Mix de Folhas',
        sobremesa: 'Pera',
        suco: 'Acerola'
      }
    },
    // ... outros dias da semana
  };

  const diaAtual = cardapioSemanal[diaSelecionado];

  // Função para formatar a data como DD/MM
  const formatarData = (offset) => {
    const data = new Date();
    // Encontra a segunda-feira da semana atual
    const diaDaSemana = data.getDay(); // 0 (Dom) a 6 (Sáb)
    const diferencaParaSegunda = data.getDate() - diaDaSemana + (diaDaSemana === 0 ? -6 : 1);
    
    const novaData = new Date(data.setDate(diferencaParaSegunda + offset));
    return novaData.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const dias = [
    { key: 'segunda', label: 'Segunda', date: formatarData(0) },
    { key: 'terca', label: 'Terça', date: formatarData(1) },
    { key: 'quarta', label: 'Quarta', date: formatarData(2) },
    { key: 'quinta', label: 'Quinta', date: formatarData(3) },
    { key: 'sexta', label: 'Sexta', date: formatarData(4) },
  ];
  
  const handleEnviarFeedback = (e) => {
    e.preventDefault();
    if (nota > 0) {
      setFeedbackEnviado(true);
      // Aqui simularia o envio para a base de dados
      setTimeout(() => {
        setFeedbackEnviado(false);
        setNota(0);
        setComentario('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Cabeçalho e Seleção de Unidade (Req07) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-blue-900">🍽️ Cardápio Semanal</h1>
          <select 
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-xl focus:ring-2 focus:ring-blue-800 outline-none shadow-sm"
          >
            <option value="Campus I - Nova Suíça">Campus I - Nova Suíça</option>
            <option value="Campus II - Nova Gameleira">Campus II - Nova Gameleira</option>
            <option value="Campus Contagem">Campus Contagem</option>
          </select>
        </div>
        
        {/* Seletor de Dias */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {dias.map((dia) => (
            <button
              key={dia.key}
              onClick={() => {
                setDiaSelecionado(dia.key);
                setFeedbackEnviado(false); // Reseta o feedback ao mudar de dia
              }}
              className={`flex-shrink-0 px-4 py-3 rounded-xl font-semibold transition-all ${
                diaSelecionado === dia.key
                  ? 'bg-blue-900 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-blue-50 shadow-md'
              }`}
            >
              <div className="text-sm">{dia.label}</div>
              <div className="text-xs opacity-75">{dia.date}</div>
            </button>
          ))}
        </div>

        {/* Cardápio do Dia */}
        {diaAtual && (
          <div className="space-y-6 mb-8">
            {/* Almoço */}
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-400">
              <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-3">
                🌞 Almoço (11:00 - 14:00)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RefeicaoItem label="Prato Principal" value={diaAtual.almoco.principal} />
                <RefeicaoItem label="Guarnição" value={diaAtual.almoco.guarnicao} />
                <RefeicaoItem label="Salada" value={diaAtual.almoco.salada} />
                <RefeicaoItem label="Sobremesa" value={diaAtual.almoco.sobremesa} />
                <RefeicaoItem label="Suco" value={diaAtual.almoco.suco} />
              </div>
            </div>

            {/* Jantar */}
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-400">
              <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-3">
                🌙 Jantar (17:30 - 19:30)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RefeicaoItem label="Prato Principal" value={diaAtual.jantar.principal} />
                <RefeicaoItem label="Guarnição" value={diaAtual.jantar.guarnicao} />
                <RefeicaoItem label="Salada" value={diaAtual.jantar.salada} />
                <RefeicaoItem label="Sobremesa" value={diaAtual.jantar.sobremesa} />
                <RefeicaoItem label="Suco" value={diaAtual.jantar.suco} />
              </div>
            </div>
          </div>
        )}

        {/* Secção de Avaliação / Feedback (Req08) */}
        <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-green-500">
          <h2 className="text-xl font-bold text-blue-900 mb-2">⭐ Avaliar Refeição</h2>
          <p className="text-gray-500 text-sm mb-4">A sua opinião ajuda a nutricionista a melhorar o nosso menu!</p>
          
          {feedbackEnviado ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-bold border border-green-200 animate-pulse">
              ✅ Muito obrigada! A sua avaliação foi enviada para a equipe de nutrição.
            </div>
          ) : (
            <form onSubmit={handleEnviarFeedback} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Que nota dá à refeição de hoje?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNota(star)}
                      className={`text-3xl transition-transform transform hover:scale-110 ${
                        nota >= star ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Comentários ou sugestões (Opcional):</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-800 outline-none bg-gray-50"
                  rows="3"
                  placeholder="A comida estava muito salgada? O bife estava ótimo? Conta-nos tudo..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={nota === 0}
                className={`py-3 px-6 rounded-xl font-bold transition-all ${
                  nota > 0 
                    ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-md transform hover:scale-[1.02]' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Enviar Avaliação
              </button>
            </form>
          )}
        </div>

      </main>
    </div>
  );
};

const RefeicaoItem = ({ label, value }) => (
  <div className="bg-blue-50 p-3 rounded-lg">
    <p className="text-xs font-semibold text-blue-900 uppercase">{label}</p>
    <p className="text-gray-700 mt-1">{value}</p>
  </div>
);

export default CardapioPage;