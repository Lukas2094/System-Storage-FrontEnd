import Link from 'next/link';
import { fetchItem } from '@/app/api/functions/getEstoqueId';

export default async function DetalhesEstoque({ params }: { params: { id: string } }) {
    const item = await fetchItem(params.id);

    if (!item) {
        return <div className='text-center text-2xl text-gray-600'>Erro ao carregar o item.</div>;
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
            <div className='w-full max-w-md bg-white p-8 shadow-md rounded-lg'>
                <h1 className='text-3xl font-bold mb-6 text-green-700'>{item.nome}</h1>
                <p className='text-lg text-gray-700 mb-4'>
                    <span className='font-semibold'>Quantidade:</span> {item.quantidade}
                </p>
                <p className='text-lg text-gray-700 mb-6'>
                    <span className='font-semibold'>Localização:</span> {item.localizacao}
                </p>
                <Link href='/estoque'>
                    <button className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                        Voltar
                    </button>
                </Link>
            </div>
        </div>
    );
}