import React, { useState } from 'react';

const CardapioPreview = () => {
  const [diaSelecionado, setDiaSelecionado] = useState('hoje');
  const [refeicaoExpandida, setRefeicaoExpandida] = useState(null);

  // Cardápio semanal completo
  const cardapioSemanal = {
    hoje: {
      data: '15/05/2024 - Quarta-feira',
      almoco: {
        principal: 'Arroz, Feijão, Frango Grelhado ao Molho de Ervas',
        guarnicao: 'Batata Doce Assada com Alecrim',
        salada: 'Mix de Folhas Verdes, Tomate Cereja, Cenoura Ralada',
        sobremesa: 'Banana Caramelizada',
        suco: 'Laranja Natural',
        observacoes: 'Opção vegetariana: Omelete de Legumes'
      },
      jantar: {
        principal: 'Sopa Cremosa de Legumes com Frango Desfiado',
        guarnicao: 'Torrada Integral com Azeite',
        salada: 'Salada de Repolho Roxo com Milho',
        sobremesa: 'Maçã',
        suco: 'Uva Natural',
        observacoes: 'Opção vegetariana: Sopa de Legumes (sem carne)'
      }
    },
    amanha: {
      data: '16/05/2024 - Quinta-feira',
      almoco: {
        principal: 'Arroz Integral, Feijão Preto, Filé de Peixe ao Forno',
        guarnicao: 'Purê de Mandioquinha',
        salada: 'Rúcula, Tomate Seco, Palmito',
        sobremesa: 'Gelatina de Frutas Vermelhas',
        suco: 'Maracujá Natural',
        observacoes: 'Opção vegetariana: Torta de Legumes'
      },
      jantar: {
        principal: 'Macarrão Integral ao Sugo com Manjericão',
        guarnicao: 'Legumes Grelhados (Abobrinha, Berinjela, Pimentão)',
        salada: 'Mix de Folhas com Croutons',
        sobremesa: 'Pera',
        suco: 'Acerola com Laranja',
        observacoes: ''
      }
    },
    sexta: {
      data: '17/05/2024 - Sexta-feira',
      almoco: {
        principal: 'Arroz, Feijão Carioca, Carne Assada com Cebolas',
        guarnicao: 'Farofa de Banana',
        salada: 'Alface Americana, Beterraba, Cenoura',
        sobremesa: 'Doce de Abóbora',
        suco: 'Abacaxi com Hortelã',
        observacoes: 'Opção vegetariana: Lasanha de Berinjela'
      },
      jantar: {
        principal: 'Caldo Verde com Calabresa',
        guarnicao: 'Pão de Alho Integral',
        salada: 'Salada Caesar Simplificada',
        sobremesa: 'Manga',
        suco: 'Goiaba Natural',
        observacoes: 'Opção vegetariana: Caldo de Mandioquinha'
      }
    }
  };

  const diaAtual = cardapioSemanal[diaSelecionado];

  const diasSemana = [
    { key: 'hoje', label: 'Hoje', emoji: '📅' },
    { key: 'amanha', label: 'Amanhã', emoji: '☀️' },
    { key: 'sexta', label: 'Sexta', emoji: '🎉' }
  ];

  const toggleRefeicao = (refeicao) => {
    setRefeicaoExpandida(refeicaoExpandida === refeicao ? null : refeicao);
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Dias */}
      <div className="flex gap-2 mb-6">
        {diasSemana.map((dia) => (
          <button
            key={dia.key}
            onClick={() => {
              setDiaSelecionado(dia.key);
              setRefeicaoExpandida(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold transition-all text-sm ${
              diaSelecionado === dia.key
                ? 'bg-blue-900 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
            }`}
          >
            <span className="mr-1">{dia.emoji}</span>
            {dia.label}
          </button>
        ))}
      </div>

      {diaAtual && (
        <div className="space-y-4">
          {/* Data do Dia */}
          <div className="text-center mb-4">
            <span className="inline-block bg-blue-50 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold">
              {diaAtual.data}
            </span>
          </div>

          {/* Refeições em Accordion */}
          <div className="space-y-4">
            {/* Almoço */}
            <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleRefeicao('almoco')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌞</span>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-800">Almoço</h3>
                    <p className="text-xs text-gray-500">11:00 - 14:00</p>
                  </div>
                </div>
                <span className={`transform transition-transform text-gray-400 ${
                  refeicaoExpandida === 'almoco' ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </button>
              
              {refeicaoExpandida === 'almoco' && (
                <div className="p-4 bg-white animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CardapioItem label="Prato Principal" value={diaAtual.almoco.principal} />
                    <CardapioItem label="Guarnição" value={diaAtual.almoco.guarnicao} />
                    <CardapioItem label="Salada" value={diaAtual.almoco.salada} />
                    <CardapioItem label="Sobremesa" value={diaAtual.almoco.sobremesa} />
                    <CardapioItem label="Suco" value={diaAtual.almoco.suco} />
                  </div>
                  {diaAtual.almoco.observacoes && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">🌱</span> {diaAtual.almoco.observacoes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Jantar */}
            <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleRefeicao('jantar')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌙</span>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-800">Jantar</h3>
                    <p className="text-xs text-gray-500">17:30 - 19:30</p>
                  </div>
                </div>
                <span className={`transform transition-transform text-gray-400 ${
                  refeicaoExpandida === 'jantar' ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </button>
              
              {refeicaoExpandida === 'jantar' && (
                <div className="p-4 bg-white animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CardapioItem label="Prato Principal" value={diaAtual.jantar.principal} />
                    <CardapioItem label="Guarnição" value={diaAtual.jantar.guarnicao} />
                    <CardapioItem label="Salada" value={diaAtual.jantar.salada} />
                    <CardapioItem label="Sobremesa" value={diaAtual.jantar.sobremesa} />
                    <CardapioItem label="Suco" value={diaAtual.jantar.suco} />
                  </div>
                  {diaAtual.jantar.observacoes && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">🌱</span> {diaAtual.jantar.observacoes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

const CardapioItem = ({ label, value }) => (
  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
    <p className="text-xs font-semibold text-blue-900 uppercase mb-1">{label}</p>
    <p className="text-sm text-gray-700">{value}</p>
  </div>
);

export default CardapioPreview;