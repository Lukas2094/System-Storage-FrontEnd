import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('http://localhost:3001/estoque');
        if (!response.ok) {
            throw new Error('Erro ao buscar estoque');
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Erro ao buscar estoque' }, { status: 500 });
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
