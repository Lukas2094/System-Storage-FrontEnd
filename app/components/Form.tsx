'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Form() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Usuário ou Senha Inválido');
            }

            const { accessToken } = await response.json();

            Cookies.set('auth_token', accessToken);

            window.location.href = '/estoque';
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao fazer login');
            console.error('Erro ao fazer login:', error);
        }
    };

    return (
        <div className='flex flex-col items-center h-[542px] justify-center bg-gray-900 p-4 rounded-md'>
            <h1 className='text-4xl text-white mb-6'>Acessar Estoque</h1>
            <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-2/4'>
                <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
                    <input
                        type='text'
                        value={email}
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                        className='p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Senha'
                        className='p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    {error && <div className='text-red-500 text-md text-center font-bold'>{error}</div>}
                    <button type='submit' className='p-3 bg-blue-600 text-white rounded-md text-lg font-bold hover:bg-blue-700 transition-all'>
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
