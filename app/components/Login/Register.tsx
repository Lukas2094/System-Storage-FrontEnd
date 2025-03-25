'use client';
import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function RegisterModal() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await fetch("http://localhost:3001/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Falha no cadastro");
            }

            alert("Cadastro realizado com sucesso!");
            setFormData({ name: "", email: "", password: "" });
            window.location.href = "/login";
        } catch (error: any) {
            console.error("Erro ao cadastrar:", error);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center h-[542px] justify-center bg-gray-900 p-4 rounded-md">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Cadastro</h2>

                {errorMessage && (
                    <div className="text-red-600 bg-red-100 p-2 rounded-md text-center mb-4">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <FaUser className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nome"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="E-mail"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <div className="relative">
                        <FaLock className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Senha"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="p-3 bg-blue-600 text-white rounded-md text-lg font-bold hover:bg-blue-700 transition-all w-full"
                    >
                        Cadastrar
                    </button>
                </form>
            </div>
        </div>
    );
}
