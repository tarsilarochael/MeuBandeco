import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { buscarNomePorIdentificador } from '../services/bandecoApi';

const CreditoPage = () => {
  const [valorSelecionado, setValorSelecionado] = useState(null);
  const [valorPersonalizado, setValorPersonalizado] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  
  // Novos estados para Transferência (Req03)
  const [matriculaDestino, setMatriculaDestino] = useState('');
  const [valorTransferencia, setValorTransferencia] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [destinatario, setDestinatario] = useState(null);
  const [buscandoDestinatario, setBuscandoDestinatario] = useState(false);
  const [erroDestinatario, setErroDestinatario] = useState('');

  // Estado para o Histórico de Transações
  const [historico, setHistorico] = useState([
    { id: 1, tipo: 'Recarga', valor: 20.00, data: '12/05/2026' },
    { id: 2, tipo: 'Transferência Enviada', valor: 3.90, data: '10/05/2026' },
    { id: 3, tipo: 'Refeição - RU', valor: 3.90, data: '10/05/2026' },
  ]);

  const valoresRecarga = [10, 20, 50];
  const saldoAtual = 45.60;
  const VALOR_REFEICAO = 3.90; // Baseado na RN07

  const valorRecarga = valorPersonalizado
    ? parseFloat(String(valorPersonalizado).replace(',', '.'))
    : valorSelecionado;

  const valorRecargaValido = valorRecarga && !Number.isNaN(valorRecarga) && valorRecarga > 0;

  const matriculaLimpa = matriculaDestino.replace(/\D/g, '');
  const matriculaCompleta = matriculaLimpa.length === 11;
  const transferenciaValida = matriculaCompleta && destinatario && valorTransferencia;

  useEffect(() => {
    if (!matriculaDestino.trim()) {
      setDestinatario(null);
      setErroDestinatario('');
      setBuscandoDestinatario(false);
      return undefined;
    }

    if (!matriculaCompleta) {
      setDestinatario(null);
      setErroDestinatario('');
      setBuscandoDestinatario(false);
      return undefined;
    }

    let cancelado = false;
    setBuscandoDestinatario(true);
    setErroDestinatario('');
    setDestinatario(null);

    const timer = setTimeout(async () => {
      try {
        const usuario = await buscarNomePorIdentificador(matriculaLimpa);
        if (cancelado) return;

        if (usuario) {
          setDestinatario(usuario);
          setErroDestinatario('');
        } else {
          setDestinatario(null);
          setErroDestinatario('Aluno não encontrado para esta matrícula.');
        }
      } catch {
        if (!cancelado) {
          setDestinatario(null);
          setErroDestinatario('Não foi possível buscar o aluno. Tente novamente.');
        }
      } finally {
        if (!cancelado) setBuscandoDestinatario(false);
      }
    }, 400);

    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [matriculaDestino, matriculaCompleta, matriculaLimpa]);

  const handleRecarga = () => {
    if (valorRecargaValido) {
      const novaTransacao = {
        id: Date.now(),
        tipo: 'Recarga',
        valor: valorRecarga,
        data: new Date().toLocaleDateString('pt-BR'),
      };
      setHistorico([novaTransacao, ...historico]);
      setMostrarConfirmacao(true);
    }
  };

  const handleTransferencia = (e) => {
    e.preventDefault();
    if (!destinatario) {
      setErroDestinatario('Informe uma matrícula válida antes de transferir.');
      return;
    }
    if (parseFloat(valorTransferencia) > VALOR_REFEICAO) {
      alert(`Pela regra RN07, o valor limite de transferência é R$ ${VALOR_REFEICAO.toFixed(2)}`);
      return;
    }
    
    const novaTransferencia = {
      id: Date.now(),
      tipo: `Transferência para ${destinatario.nomUsuario}`,
      valor: parseFloat(valorTransferencia),
      data: new Date().toLocaleDateString('pt-BR'),
    };

    setHistorico([novaTransferencia, ...historico]);
    setMensagemSucesso(`Transferência de R$ ${valorTransferencia} para ${destinatario.nomUsuario} realizada com sucesso!`);
    setMatriculaDestino('');
    setValorTransferencia('');
    setDestinatario(null);
    setErroDestinatario('');
    
    setTimeout(() => setMensagemSucesso(''), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-blue-900">💳 Créditos</h1>
          <button
            type="button"
            onClick={() => setMostrarHistorico(true)}
            className="text-sm text-blue-900 hover:text-blue-700 hover:underline font-semibold shrink-0 pt-1"
          >
            Ver últimas movimentações
          </button>
        </div>

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
                    type="button"
                    onClick={() => {
                      setValorSelecionado(valor);
                      setValorPersonalizado('');
                    }}
                    className={`py-3 px-4 rounded-xl font-bold transition-all ${
                      valorSelecionado === valor && !valorPersonalizado
                        ? 'bg-blue-900 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    R$ {valor},00
                  </button>
                ))}
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Outro valor"
                  value={valorPersonalizado}
                  onChange={(e) => {
                    setValorPersonalizado(e.target.value);
                    setValorSelecionado(null);
                  }}
                  className={`py-3 px-4 rounded-xl font-bold transition-all outline-none border-2 ${
                    valorPersonalizado
                      ? 'border-blue-900 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-gray-100 text-gray-700 placeholder:text-gray-500 placeholder:font-semibold focus:border-blue-900 focus:bg-blue-50'
                  }`}
                />
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
              disabled={!valorRecargaValido}
              className={`w-full py-4 rounded-xl font-bold transition-all ${valorRecargaValido ? 'bg-blue-900 text-white' : 'bg-gray-300 text-gray-500'}`}
            >
              Recarregar R$ {valorRecargaValido ? valorRecarga.toFixed(2) : '0,00'}
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
                  placeholder="Ex: 22222222222"
                  className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-800 outline-none"
                  value={matriculaDestino}
                  onChange={(e) => setMatriculaDestino(e.target.value)}
                />
                {buscandoDestinatario && (
                  <p className="mt-2 text-sm text-gray-500">Buscando aluno...</p>
                )}
                {destinatario && !buscandoDestinatario && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Destinatário:</span> {destinatario.nomUsuario}
                    </p>
                  </div>
                )}
                {erroDestinatario && !buscandoDestinatario && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{erroDestinatario}</p>
                )}
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
                disabled={!transferenciaValida || buscandoDestinatario}
                className={`w-full py-4 font-bold rounded-xl shadow-md transition-transform active:scale-95 ${
                  transferenciaValida && !buscandoDestinatario
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirmar Transferência
              </button>
            </form>
          </div>
        </div>

        {/* Modal de Confirmação de Recarga */}
        {mostrarConfirmacao && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">✅ Recarga Confirmada!</h3>
              <p className="text-gray-600 mb-6">O valor de <strong>R$ {valorRecarga?.toFixed(2)}</strong> já foi adicionado ao seu saldo.</p>
              <button onClick={() => setMostrarConfirmacao(false)} className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl">OK!</button>
            </div>
          </div>
        )}

        {mostrarHistorico && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-blue-900">🕒 Últimas movimentações</h3>
                <button
                  type="button"
                  onClick={() => setMostrarHistorico(false)}
                  className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                  aria-label="Fechar"
                >
                  ×
                </button>
              </div>
              <div className="overflow-x-auto overflow-y-auto flex-1">
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
          </div>
        )}
      </main>
    </div>
  );
};

export default CreditoPage;