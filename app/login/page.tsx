import Link from 'next/link';

export default function Home() {
    return (
        <div className='flex flex-col items-center justify-center h-[500px] bg-gray-900 p-4'>
            <h1 className='text-4xl text-white mb-6'>Acessar Estoque</h1>
            <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-80'>
                <form className='flex flex-col space-y-4'>
                    <input
                        type='text'
                        placeholder='Usuário'
                        className='p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type='password'
                        placeholder='Senha'
                        className='p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <button
                        type='submit'
                        className='p-3 bg-blue-600 text-white rounded-md text-lg font-bold hover:bg-blue-700 transition-all'
                    >
                        Entrar
                    </button>
                </form>
                <div className='mt-4 text-center'>
                    <Link href='/register' className='text-blue-400 hover:underline'>Criar conta</Link>
                </div>
            </div>
        </div>
    );
}
