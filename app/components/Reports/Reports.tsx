'use client';
import { useState, useEffect } from 'react';
import { FiDownload, FiFilter, FiX, FiArrowLeft, FiCheck, FiPlus, FiSave, FiEdit, FiTrash2, FiFileText } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Movimentacao {
    id: number;
    data: string;
    tipo: string;
    produto_id: number;
    produto_nome: string;
    quantidade: number;
    responsavel: string;
    observacao?: string;
}

interface Produto {
    id: number;
    nome: string;
}

interface MovimentacaoFormData {
    id?: number;
    produto_id: number;
    tipo: 'entrada' | 'saida';
    quantidade: number;
    responsavel: string;
    observacao?: string;
}

function MovimentacaoForm({
    produtos,
    movimentacao,
    onClose,
    onSuccess
}: {
    produtos: Produto[];
    movimentacao?: Movimentacao | null;
    onClose: () => void;
    onSuccess: () => void
}) {
    const [formData, setFormData] = useState<MovimentacaoFormData>({
        produto_id: produtos[0]?.id || 0,
        tipo: 'entrada',
        quantidade: 0,
        responsavel: '',
        observacao: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (movimentacao) {
            setFormData({
                id: movimentacao.id,
                produto_id: movimentacao.produto_id,
                tipo: movimentacao.tipo as 'entrada' | 'saida',
                quantidade: movimentacao.quantidade,
                responsavel: movimentacao.responsavel,
                observacao: movimentacao.observacao
            });
        }
    }, [movimentacao]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = formData.id
                ? `/api/movimentacoes/${formData.id}`
                : '/api/movimentacoes';

            const method = formData.id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao salvar movimentação');
            }

            onClose();
            onSuccess();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar movimentação');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantidade' ? Number(value) : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        {formData.id ? 'Editar Movimentação' : 'Nova Movimentação'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                        <select
                            name="produto_id"
                            value={formData.produto_id}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            {produtos.map(produto => (
                                <option key={produto.id} value={produto.id}>
                                    {produto.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="entrada">Entrada</option>
                            <option value="saida">Saída</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                        <input
                            type="number"
                            name="quantidade"
                            min="1"
                            value={formData.quantidade}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                        <input
                            type="text"
                            name="responsavel"
                            value={formData.responsavel}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observação (Opcional)</label>
                        <textarea
                            name="observacao"
                            value={formData.observacao || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : (
                                <>
                                    <FiSave className="mr-2" />
                                    Salvar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Reports() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);
    const [filtros, setFiltros] = useState({
        tipo: '',
        produto: '',
        dataInicio: '',
        dataFim: ''
    });
    const [showMovimentacaoForm, setShowMovimentacaoForm] = useState(false);
    const [movimentacaoEditando, setMovimentacaoEditando] = useState<Movimentacao | null>(null);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Carrega movimentações
    useEffect(() => {
        carregarMovimentacoes();
        carregarProdutos();
    }, []);

    const carregarMovimentacoes = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filtros.tipo) params.append('tipo', filtros.tipo);
            if (filtros.produto) params.append('produto', filtros.produto);
            if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
            if (filtros.dataFim) params.append('dataFim', filtros.dataFim);

            const response = await fetch(`/api/movimentacoes?${params.toString()}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao carregar movimentações');
            }

            const data = await response.json();
            setMovimentacoes(data);
        } catch (error) {
            console.error('Erro ao carregar movimentações:', error);
            setError(error instanceof Error ? error.message : 'Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const carregarProdutos = async () => {
        try {
            const response = await fetch('/api/estoques');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao carregar produtos');
            }

            const data = await response.json();
            setProdutos(data.map((p: any) => ({ id: p.id, nome: p.nome })));
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            setError(error instanceof Error ? error.message : 'Erro ao carregar produtos');
        }
    };

    const gerarRelatorioExcel = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filtros.tipo) params.append('tipo', filtros.tipo);
            if (filtros.produto) params.append('produto', filtros.produto);
            if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
            if (filtros.dataFim) params.append('dataFim', filtros.dataFim);

            const response = await fetch(`/api/movimentacoes/relatorio?${params.toString()}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao gerar relatório');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio_movimentacoes_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao gerar relatório Excel:', error);
            setError(error instanceof Error ? error.message : 'Erro ao gerar relatório');
        } finally {
            setLoading(false);
        }
    };

    // Gera relatório CSV
    const gerarRelatorioCsv = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filtros.tipo) params.append('tipo', filtros.tipo);
            if (filtros.produto) params.append('produto', filtros.produto);
            if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
            if (filtros.dataFim) params.append('dataFim', filtros.dataFim);

            const response = await fetch(`/api/movimentacoes/relatorio/csv?${params.toString()}`);

            if (!response.ok) {
                // Tenta obter a mensagem de erro detalhada
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.error ||
                    response.statusText ||
                    'Erro ao gerar relatório CSV'
                );
            }

            const blob = await response.blob();

            // Verifica se o blob contém dados válidos
            if (blob.size === 0) {
                throw new Error('O arquivo CSV está vazio');
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `movimentacoes_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();

            // Limpeza
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);

        } catch (error) {
            console.error('Detalhes do erro ao gerar CSV:', error);
            setError(error instanceof Error ? error.message : 'Erro desconhecido ao gerar CSV');
        } finally {
            setLoading(false);
        }
    };

    // Excluir movimentação
    const excluirMovimentacao = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir esta movimentação?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`/api/movimentacoes/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao excluir movimentação');
            }

            carregarMovimentacoes();
        } catch (error) {
            console.error('Erro ao excluir movimentação:', error);
            setError(error instanceof Error ? error.message : 'Erro ao excluir movimentação');
        } finally {
            setLoading(false);
        }
    };

    // Aplica filtros
    const aplicarFiltros = () => {
        carregarMovimentacoes();
        setFiltrosAbertos(false);
    };

    // Limpa filtros
    const limparFiltros = () => {
        setFiltros({
            tipo: '',
            produto: '',
            dataInicio: '',
            dataFim: ''
        });
        carregarMovimentacoes();
        setFiltrosAbertos(false);
    };

    return (
        <div className="container mx-auto p-4">
            {/* Notificação de erro */}
            {error && (
                <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg flex items-center">
                    <span>{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="ml-4 text-white hover:text-gray-200"
                    >
                        <FiX size={20} />
                    </button>
                </div>
            )}

            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-white hover:text-blue-800 font-bold bg-yellow-400 px-4 py-2 rounded"
                >
                    <FiArrowLeft className="mr-2" />
                    Voltar
                </button>
                <h1 className="text-2xl font-bold text-white">Relatórios de Movimentações</h1>
                <div className="w-8"></div> {/* Espaçador */}
            </div>

            {/* Filtros */}
            <div className="mb-6">
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            setMovimentacaoEditando(null);
                            setShowMovimentacaoForm(true);
                        }}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <FiPlus className="mr-2" />
                        Nova Movimentação
                    </button>
                    <button
                        onClick={() => setFiltrosAbertos(!filtrosAbertos)}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        <FiFilter className="mr-2" />
                        Filtros
                    </button>
                </div>

                {filtrosAbertos && (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                <select
                                    value={filtros.tipo}
                                    onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Todos</option>
                                    <option value="entrada">Entrada</option>
                                    <option value="saida">Saída</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                                <input
                                    type="text"
                                    value={filtros.produto}
                                    onChange={(e) => setFiltros({ ...filtros, produto: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    placeholder="Filtrar por produto"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                                <input
                                    type="date"
                                    value={filtros.dataInicio}
                                    onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                                <input
                                    type="date"
                                    value={filtros.dataFim}
                                    onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={limparFiltros}
                                className="px-4 py-2 border rounded flex items-center"
                            >
                                <FiX className="mr-2" />
                                Limpar
                            </button>
                            <button
                                onClick={aplicarFiltros}
                                className="px-4 py-2 bg-green-600 text-white rounded flex items-center hover:bg-green-700"
                            >
                                <FiCheck className="mr-2" />
                                Aplicar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabela e botão de exportação */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Histórico de Movimentações</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={gerarRelatorioCsv}
                            disabled={loading}
                            className={`px-4 py-2 rounded flex items-center ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        >
                            <FiFileText className="mr-2" />
                            {loading ? 'Gerando...' : 'Exportar CSV'}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observação</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(movimentacoes) && movimentacoes.length > 0 ? (
                                movimentacoes.map((mov) => (
                                    <tr key={mov.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(mov.data).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${mov.tipo === 'entrada'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {mov.tipo.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {mov.produto_nome}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {mov.quantidade}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {mov.responsavel}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {mov.observacao || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setMovimentacaoEditando(mov);
                                                        setShowMovimentacaoForm(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Editar"
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button
                                                    onClick={() => excluirMovimentacao(mov.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Excluir"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        {loading ? 'Carregando...' : 'Nenhuma movimentação encontrada.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showMovimentacaoForm && (
                <MovimentacaoForm
                    produtos={produtos}
                    movimentacao={movimentacaoEditando}
                    onClose={() => {
                        setShowMovimentacaoForm(false);
                        setMovimentacaoEditando(null);
                    }}
                    onSuccess={() => {
                        carregarMovimentacoes();
                        setShowMovimentacaoForm(false);
                        setMovimentacaoEditando(null);
                    }}
                />
            )}
        </div>
    );
}