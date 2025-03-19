import { Estoque } from "@/public/interfaces/Estoques";

 export async function fetchEstoque(): Promise<Estoque[] | null> {
    try {
        const response = await fetch('http://localhost:3000/api/estoques', { cache: 'no-store' });
        if (!response.ok) {
            console.error('Erro ao buscar estoque:', response.statusText);
            return null;
        }
        return response.json();
    } catch (error) {
        console.error('Erro ao buscar estoque:', error);
        return null;
    }
}