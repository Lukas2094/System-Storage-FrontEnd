// app/api/movimentacoes/route.ts
import { NextResponse } from 'next/server';

// Função GET existente (mantida para referência)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const produto = searchParams.get('produto');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');

    try {
        const response = await fetch(`http://localhost:3001/estoque/movimentacoes?tipo=${tipo}&produto=${produto}&dataInicio=${dataInicio}&dataFim=${dataFim}`);
        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro ao buscar movimentações' },
            { status: 500 }
        );
    }
}

// Nova função POST para criar movimentações
export async function POST(request: Request) {
    try {
        // Extrai os dados do corpo da requisição
        const body = await request.json();

        // Validação básica dos campos obrigatórios
        if (!body.produto_id || !body.tipo || !body.quantidade || !body.responsavel) {
            return NextResponse.json(
                { error: 'Campos obrigatórios faltando: produto_id, tipo, quantidade, responsavel' },
                { status: 400 }
            );
        }

        // Converte a quantidade para número
        const quantidade = Number(body.quantidade);
        if (isNaN(quantidade) || quantidade <= 0) {
            return NextResponse.json(
                { error: 'Quantidade deve ser um número positivo' },
                { status: 400 }
            );
        }

        // Verifica se o tipo é válido
        if (body.tipo !== 'entrada' && body.tipo !== 'saida') {
            return NextResponse.json(
                { error: 'Tipo de movimentação inválido (deve ser "entrada" ou "saida")' },
                { status: 400 }
            );
        }

        // Faz a requisição para o backend NestJS
        const response = await fetch('http://localhost:3001/estoque/movimentacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                produto_id: body.produto_id,
                tipo: body.tipo,
                quantidade: quantidade,
                responsavel: body.responsavel,
                observacao: body.observacao || null
            }),
        });

        // Se a resposta não for OK, lança erro
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao registrar movimentação');
        }

        // Retorna os dados da movimentação criada
        const data = await response.json();
        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error('Erro no endpoint POST /api/movimentacoes:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erro interno no servidor' },
            { status: 500 }
        );
    }
}