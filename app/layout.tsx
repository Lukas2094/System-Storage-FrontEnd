// src/app/layout.tsx
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation'; // Use redirect para redirecionamentos
import './globals.css';
import Sidebar from './components/SideBar';

export const metadata: Metadata = {
  title: 'Sistema de Estoque',
  description: 'Gerencie seu estoque de forma eficiente',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get('accessToken')?.value;
  const headersList = await headers();
  const pathname = headersList.get('x-next-pathname') || '/';


  if (!token && !['/', '/login'].includes(pathname)) {
    redirect('/');
  }

  if (token && pathname === '/') {
    redirect('/estoque');
  }

  return (
    <html lang="pt-BR">
      <body className="!bg-blue-700 flex">
        {token ? <Sidebar /> : null}
        <main className="flex-1">
          {token ? (
            <header className="bg-yellow-500 text-white p-4 text-2xl font-bold">
              System Storage
            </header>
          ) : null}
          <div className="p-5">{children}</div>
        </main>
      </body>
    </html>
  );
}