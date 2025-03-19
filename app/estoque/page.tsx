// app/estoque/page.tsx
'use client'; // Adicione 'use client' para usar hooks e estado
import Link from 'next/link';
import { fetchEstoque } from '../api/functions/getEstoque';
import { FaEdit, FaExternalLinkSquareAlt, FaTrash } from 'react-icons/fa'; // Ícones de editar e deletar
import { useEffect, useState } from 'react';
import EditarModal from '../components/Modal';
import { Estoque } from '@/public/interfaces/Estoques';


export default function EstoquePage() {
    const [estoque, setEstoque] = useState<Estoque[]>([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [itemEditando, setItemEditando] = useState<Estoque | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchEstoque();
            if (data) setEstoque(data);
        };
        fetchData();
    }, []);

    const handleEditar = (item: Estoque) => {
        setItemEditando(item);
        setModalAberto(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/estoques/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar item');
            }
            window.location.reload(); 
        } catch (error) {
            console.error('Erro ao deletar item:', error);
        }
    };

    const handleSalvar = async (id: number, nome: string, quantidade: number, localizacao: string, categoria: string) => {
        try {
            const response = await fetch(`/api/estoques/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, quantidade, localizacao, categoria }),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar item');
            }

            const updatedEstoque = estoque.map((item) =>
                item.id === id ? { ...item, nome, quantidade, localizacao, categoria } : item
            );
            setEstoque(updatedEstoque);
            return response.json();
        } catch (error) {
            console.error('Erro ao atualizar item:', error);
        }
    };

    if (!estoque) {
        return <div className='text-4xl text-red-600 font-bold'>Erro ao carregar o estoque. Tente novamente mais tarde.</div>;
    }

    return (
        <div className='flex flex-col items-center p-9 bg-gray-100 rounded-2xl'>
            <h1 className='text-5xl m-5 text-amber-700 font-extrabold underline'>Estoque</h1>
            <Link className='text-2xl text-white font-bold m-5' href="/estoque/criar">
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl'>
                    Criar Novo Item
                </button>
            </Link>

            {/* Tabela de Estoque */}
            <div className='w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden'>
                <table className='w-full'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Nome
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Quantidade
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Localização
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Categoria
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                        {estoque.map((item) => (
                            <tr key={item.id} className='hover:bg-gray-50 transition-colors'>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                    {item?.nome}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                    {item?.quantidade}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                    {item?.localizacao}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                    {item?.categoria}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4'>
                                    <button
                                        onClick={() => handleEditar(item)}
                                        className='text-indigo-600 hover:text-indigo-900'
                                    >
                                        <FaEdit className='inline-block' />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className='text-red-600 hover:text-red-900'
                                    >
                                        <FaTrash className='inline-block' />
                                    </button>
                                    <Link href={`/estoque/${item.id}`}>
                                        <FaExternalLinkSquareAlt className='inline-block' />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Edição */}
            {modalAberto && itemEditando && (
                <EditarModal
                    item={itemEditando}
                    onClose={() => setModalAberto(false)}
                    onSave={handleSalvar}
                />
            )}
        </div>
    );
}