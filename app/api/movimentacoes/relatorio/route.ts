// app/api/movimentacoes/relatorio/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const produto = searchParams.get('produto');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');

    try {

        const response = await fetch(
            `http://localhost:3001/estoque/relatorio/movimentacoes?tipo=${tipo}&produto=${produto}&dataInicio=${dataInicio}&dataFim=${dataFim}`
        );

        if (!response.ok) {
            throw new Error('Erro ao gerar relatório');
        }
        return new Response(await response.blob(), {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=relatorio_movimentacoes.xlsx'
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro ao gerar relatório' },
            { status: 500 }
        );
    }
}