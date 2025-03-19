import { NextResponse , NextRequest } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const response = await fetch(`http://localhost:3001/estoque/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar item no estoque');
        }

        const data = await response.json();
        return NextResponse.json(data); 
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Erro ao buscar item no estoque' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const response = await fetch(`http://localhost:3001/estoque/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar item no estoque');
        }

        return NextResponse.json({ message: 'Item deletado com sucesso' });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Erro ao deletar item no estoque' }, { status: 500 });
    }
};

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } } 
) {
    try {

        const { id } = params;

        const { nome, quantidade, localizacao, categoria } = await request.json();

        const response = await fetch(`http://localhost:3001/estoque/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, quantidade, localizacao, categoria }),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar o estoque');
        }

        const data = await response;
        return NextResponse.json(data);
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}