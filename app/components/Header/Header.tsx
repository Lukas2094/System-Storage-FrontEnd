'use client';
import Link from "next/link";
import { IoMdLogOut } from "react-icons/io";

const getTokenFromCookies = () => {
    const name = "auth_token=";
    const decodedCookies = decodeURIComponent(document.cookie);
    const cookiesArray = decodedCookies.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null; 
};

const clearAllCookies = () => {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        const cookieName = cookie.split('=')[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
};

export default function Header() {  
    const handleLogout = async () => {
        try {
            const token = getTokenFromCookies();

            if (!token) {
                alert("Você não está autenticado!");
                return;
            }

            const response = await fetch('http://localhost:3001/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Falha ao realizar o logout');
            }

            const data = await response.json();
            clearAllCookies();
            alert(data.message); 
            window.location.href = '/'; 
        } catch (error) {
            console.error('Erro no logout:', error);
            alert('Erro ao tentar fazer logout');
        }
    };

    return (
        <header className="bg-blue-900 text-white p-4 text-2xl font-bold">
            <nav className="inline-flex items-center justify-between w-full">
                System Storage

                <div className="flex items-center h-[40px]">
                    <Link className='text-2xl text-white font-bold m-5' href="/estoque/criar">
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl'>
                            Criar Novo Item
                        </button>
                    </Link>
                    <button
                        className="float-right bg-red-700 p-2 text-base rounded-md cursor-pointer"
                        title="Logout"
                        onClick={handleLogout}
                    >
                        <IoMdLogOut />
                    </button> 
                </div>
          
            </nav>
        </header>
    );
}
