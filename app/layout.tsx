// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Sidebar from './components/SideBar';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Sistema de Estoque',
  description: 'Gerencie seu estoque de forma eficiente',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('auth_token')?.value;

  return (
    <html lang="pt-BR">
      <body className="!bg-blue-700 flex">
        {token ? <Sidebar /> : null}
        <main className="flex-1">
          {token && (
            <header className="bg-yellow-500 text-white p-4 text-2xl font-bold">
              System Storage
            </header>
          )}
          <div className="p-5">{children}</div>
        </main>
      </body>
    </html>
  );
}
