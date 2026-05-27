import React, { useState } from 'react';
import Header from '../components/Header';

const CreditoPage = () => {
  const [valorSelecionado, setValorSelecionado] = useState(null);
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  
  // Novos estados para Transferência (Req03)
  const [matriculaDestino, setMatriculaDestino] = useState('');
  const [valorTransferencia, setValorTransferencia] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // Estado para o Histórico de Transações
  const [historico, setHistorico] = useState([
    { id: 1, tipo: 'Recarga', valor: 20.00, data: '12/05/2026', status: 'Concluído' },
    { id: 2, tipo: 'Transferência Enviada', valor: 3.90, data: '10/05/2026', status: 'Concluído' },
    { id: 3, tipo: 'Refeição - RU', valor: 3.90, data: '10/05/2026', status: 'Concluído' },
  ]);

  const valoresRecarga = [10, 20, 50, 100];
  const saldoAtual = 45.60;
  const VALOR_REFEICAO = 3.90; // Baseado na RN07

  const handleRecarga = () => {
    if (valorSelecionado) {
      const novaTransacao = {
        id: Date.now(),
        tipo: 'Recarga',
        valor: valorSelecionado,
        data: new Date().toLocaleDateString('pt-BR'),
        status: 'Concluído'
      };
      setHistorico([novaTransacao, ...historico]);
      setMostrarConfirmacao(true);
    }
  };

  const handleTransferencia = (e) => {
    e.preventDefault();
    if (parseFloat(valorTransferencia) > VALOR_REFEICAO) {
      alert(`Pela regra RN07, o valor limite de transferência é R$ ${VALOR_REFEICAO.toFixed(2)}`);
      return;
    }
    
    const novaTransferencia = {
      id: Date.now(),
      tipo: `Transferência para ${matriculaDestino}`,
      valor: parseFloat(valorTransferencia),
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'Concluído'
    };

    setHistorico([novaTransferencia, ...historico]);
    setMensagemSucesso(`Transferência de R$ ${valorTransferencia} para a matrícula ${matriculaDestino} realizada com sucesso!`);
    setMatriculaDestino('');
    setValorTransferencia('');
    
    setTimeout(() => setMensagemSucesso(''), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">💳 Créditos</h1>

        {/* Saldo Atual */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <p className="text-blue-200 text-sm">Saldo Disponível</p>
          <p className="text-5xl font-bold mt-2">R$ {saldoAtual.toFixed(2)}</p>
          <p className="text-blue-200 text-sm mt-2">Valor da Refeição: R$ {VALOR_REFEICAO.toFixed(2)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Seção de Recarga */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-6">📱 Recarregar</h2>
            
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Selecione o valor:</p>
              <div className="grid grid-cols-2 gap-3">
                {valoresRecarga.map((valor) => (
                  <button
                    key={valor}
                    onClick={() => setValorSelecionado(valor)}
                    className={`py-3 px-4 rounded-xl font-bold transition-all ${
                      valorSelecionado === valor
                        ? 'bg-blue-900 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    R$ {valor},00
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Pagamento:</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setMetodoPagamento('pix')}
                  className={`flex-1 py-2 rounded-lg font-semibold ${metodoPagamento === 'pix' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Pix
                </button>
                <button
                  onClick={() => setMetodoPagamento('cartao')}
                  className={`flex-1 py-2 rounded-lg font-semibold ${metodoPagamento === 'cartao' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Cartão
                </button>
              </div>
            </div>

            <button
              onClick={handleRecarga}
              disabled={!valorSelecionado}
              className={`w-full py-4 rounded-xl font-bold transition-all ${valorSelecionado ? 'bg-blue-900 text-white' : 'bg-gray-300 text-gray-500'}`}
            >
              Recarregar R$ {valorSelecionado ? valorSelecionado.toFixed(2) : '0,00'}
            </button>
          </div>

          {/* Transferência entre Alunos */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-blue-500">
            <h2 className="text-xl font-bold text-blue-900 mb-4">💸 Transferir Saldo</h2>
            <p className="text-sm text-gray-500 mb-6">Envie créditos para outro colega instantaneamente.</p>
            
            {mensagemSucesso && (
              <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 text-sm font-semibold border border-green-200">
                ✅ {mensagemSucesso}
              </div>
            )}

            <form onSubmit={handleTransferencia} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Matrícula do Destinatário</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: 2023123456"
                  className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-800 outline-none"
                  value={matriculaDestino}
                  onChange={(e) => setMatriculaDestino(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Valor</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-800 outline-none"
                  value={valorTransferencia}
                  onChange={(e) => setValorTransferencia(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-transform active:scale-95"
              >
                Confirmar Transferência
              </button>
            </form>
          </div>
        </div>

        {/* HISTÓRICO DE TRANSAÇÕES */}
        <div className="bg-white rounded-2xl shadow-md p-6 overflow-hidden">
          <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            🕒 Histórico Recente
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-2 text-xs font-bold text-gray-400 uppercase">Data</th>
                  <th className="py-3 px-2 text-xs font-bold text-gray-400 uppercase">Tipo</th>
                  <th className="py-3 px-2 text-xs font-bold text-gray-400 uppercase text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-2 text-sm text-gray-600">{item.data}</td>
                    <td className="py-4 px-2">
                      <p className="text-sm font-semibold text-gray-800">{item.tipo}</p>
                      <p className="text-[10px] text-green-600 font-bold uppercase">{item.status}</p>
                    </td>
                    <td className={`py-4 px-2 text-sm font-bold text-right ${item.tipo === 'Recarga' ? 'text-green-600' : 'text-red-500'}`}>
                      {item.tipo === 'Recarga' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Confirmação de Recarga */}
        {mostrarConfirmacao && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">✅ Recarga Confirmada!</h3>
              <p className="text-gray-600 mb-6">O valor de <strong>R$ {valorSelecionado?.toFixed(2)}</strong> já foi adicionado ao seu saldo.</p>
              <button onClick={() => setMostrarConfirmacao(false)} className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl">OK!</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreditoPage;