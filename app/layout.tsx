// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Sidebar from './components/SideBar';
import { cookies } from 'next/headers';
import Header from './components/Header';

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
            <Header />
          )}
          <div className="p-5">{children}</div>
        </main>
      </body>
    </html>
  );
}
