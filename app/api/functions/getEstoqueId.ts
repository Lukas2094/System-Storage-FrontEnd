import { Estoque } from "@/public/interfaces/Estoques";

export async function fetchItem(id: string): Promise<Estoque | null> {
    try {
        const response = await fetch(`http://localhost:3000/api/estoques/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar item no estoque');
        }
        return response.json();
    } catch (error) {
        console.error('Erro ao buscar item:', error);
        return null;
    }
}