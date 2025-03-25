// app/api/movimentacoes/[id]/route.ts
import { NextResponse } from 'next/server';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validação básica
        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { error: 'ID inválido' },
                { status: 400 }
            );
        }

        // Chamada para o backend NestJS
        const nestResponse = await fetch(`http://localhost:3001/estoque/movimentacao/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!nestResponse.ok) {
            const error = await nestResponse.json();
            throw new Error(error.message || 'Erro ao atualizar movimentação');
        }

        const data = await nestResponse.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erro interno' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { error: 'ID inválido' },
                { status: 400 }
            );
        }

        const nestResponse = await fetch(`http://localhost:3001/estoque/movimentacao/${id}`, {
            method: 'DELETE',
        });

        if (!nestResponse.ok) {
            const error = await nestResponse.json();
            throw new Error(error.message || 'Erro ao excluir movimentação');
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erro interno' },
            { status: 500 }
        );
    }
}