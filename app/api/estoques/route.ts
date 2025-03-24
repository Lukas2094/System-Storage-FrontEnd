import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        if (!cookieStore) {
            throw new Error('Erro ao acessar cookies');
        }

        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            console.error('Token não encontrado');
            return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
        }

        const response = await fetch('http://localhost:3001/estoque', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorDetails = await response.text(); 
            console.error('Erro ao buscar estoque: ', errorDetails);
            throw new Error(`Erro ao buscar estoque. Status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Erro na execução da função GET:', error.message || error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ error: 'Erro desconhecido ao buscar estoque' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nome, quantidade, localizacao, categoria } = body;

        const response = await fetch('http://localhost:3001/estoque', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, quantidade, localizacao , categoria }),
        });

        if (!response.ok) {
            throw new Error('Erro ao criar item no estoque');
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Erro ao criar item no estoque' }, { status: 500 });
    }
};
