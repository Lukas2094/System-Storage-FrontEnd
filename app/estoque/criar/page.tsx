'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CriarEstoque() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [localizacao, setLocalizacao] = useState('');
  const [categoria, setCategoria] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/estoques', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, quantidade, localizacao, categoria }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar item no estoque');
      }

      router.push('/estoque');
    } catch (error) {
      console.error('Erro ao criar item:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center bg-gray-100 p-6 rounded-md'>
      <h1 className='text-3xl font-bold mb-2 text-black'>Criar Novo Item</h1>
      <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-4 shadow-md rounded-lg'>
        <div className=''>
          <label className='block text-sm font-medium text-gray-700'>Nome:</label>
          <input
            type='text'
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>Quantidade:</label>
          <input
            type='text'
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
        </div>
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700'>Localização:</label>
          <input
            type='text'
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
        </div>

        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700'>Categoria:</label>
          <input
            type='text'
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Criar
        </button>
      </form>
    </div>
  );
}