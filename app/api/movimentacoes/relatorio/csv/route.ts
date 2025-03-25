// app/api/relatorio/csv/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Construa a URL para o backend NestJS
        const nestUrl = new URL('http://localhost:3001/estoque/relatorio/movimentacoes/csv');
        searchParams.forEach((value, key) => {
            nestUrl.searchParams.append(key, value);
        });

        const response = await fetch(nestUrl.toString());

        if (!response.ok) {
            // Se o NestJS retornar um erro JSON, tente extrair a mensagem
            if (response.headers.get('content-type')?.includes('application/json')) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao gerar relatório CSV');
            } else {
                // Caso contrário, use o status text
                throw new Error(response.statusText);
            }
        }

        // Crie uma nova resposta com os dados do NestJS
        return new Response(response.body, {
            status: response.status,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=movimentacoes.csv',
            },
        });

    } catch (error) {
        console.error('Erro na API de relatório CSV:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erro interno' },
            { status: 500 }
        );
    }
}