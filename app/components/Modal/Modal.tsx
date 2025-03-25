'use client'; 
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa'; 

interface EditarModalProps {
    item: {
        id: number;
        nome: string;
        quantidade: number;
        localizacao: string;
        categoria: string;
    };
    onClose: () => void;
    onSave: (id: number, nome: string, quantidade: number, localizacao: string, categoria: string) => void;
}

export default function EditarModal({ item, onClose, onSave }: EditarModalProps) {
    const [nome, setNome] = useState(item.nome);
    const [quantidade, setQuantidade] = useState(item.quantidade);
    const [localizacao, setLocalizacao] = useState(item.localizacao);
    const [categoria, setCategoria] = useState(item.categoria);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(item.id, nome, quantidade, localizacao, categoria);
        onClose();
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold'>Editar Item</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700'>Nome:</label>
                        <input
                            type='text'
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700'>Quantidade:</label>
                        <input
                            type='number'
                            value={quantidade}
                            onChange={(e) => setQuantidade(Number(e.target.value))}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            required
                        />
                    </div>
                    <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700'>Localização:</label>
                        <input
                            type='text'
                            value={localizacao}
                            onChange={(e) => setLocalizacao(e.target.value)}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            required
                        />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700'>Categoria:</label>
                        <input
                            type='text'
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            required
                        />
                    </div>
                    <div className='flex justify-end space-x-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
                        >
                            Cancelar
                        </button>
                        <button
                            type='submit'
                            className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}