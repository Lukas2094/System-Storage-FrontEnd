'use client';

import Link from 'next/link';
import { BsBoxSeam } from "react-icons/bs";
import { FaList } from "react-icons/fa";
import { useState } from 'react';
import Image from 'next/image';

export default function Sidebar() {
    const [isMenuMinimized, setIsMenuMinimized] = useState(true);
    const [isHovered, setIsHovered] = useState(false); 

    const toggleMenu = () => {
        setIsMenuMinimized(!isMenuMinimized);
    };

    return (
        <aside
            className={`w-20 ${isHovered || !isMenuMinimized ? 'w-64' : 'w-20'} bg-yellow-500 text-white h-screen p-5 flex flex-col transition-all duration-300`}
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)} 
        >
            <Link href="/">
                <Image src="/img/png/box.png" alt="Logo" width={50} height={50} />
            </Link>
            <nav className='mt-15'>
                <ul className="space-y-3">
                    <li>
                        <Link href="/estoque" className="block p-2 bg-gray-900 rounded hover:bg-gray-500">
                            <span className={`flex items-center ${isMenuMinimized && !isHovered ? 'justify-center' : ''}`}>
                                <BsBoxSeam className={`${isMenuMinimized && !isHovered ? '' : 'mr-2'}`} />
                                <span className={`${isHovered || !isMenuMinimized ? 'inline' : 'hidden'}`}>
                                    Estoque
                                </span>
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/pedidos" className="block p-2 bg-gray-900 rounded hover:bg-gray-500">
                            <span className={`flex items-center ${isMenuMinimized && !isHovered ? 'justify-center' : ''}`}>
                                <FaList className={`${isMenuMinimized && !isHovered ? '' : 'mr-2'}`} />
                             
                                <span className={`${isHovered || !isMenuMinimized ? 'inline' : 'hidden'}`}>
                                    Pedidos
                                </span>
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}