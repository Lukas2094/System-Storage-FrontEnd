'use client';
import { useRouter } from "next/router";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function PasswordReset() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetToken, setResetToken] = useState(""); // Novo estado para armazenar o token de redefinição
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");

    const handleRequestReset = async () => {
        try {
            const response = await fetch("http://localhost:3001/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error("Erro ao solicitar redefinição de senha");
            }

            alert("E-mail de redefinição enviado!");
            setStep(2); // Avança para a segunda etapa onde o usuário define a nova senha
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            const response = await fetch("http://localhost:3001/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: resetToken, newPassword }) // Passa o token e a nova senha
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar senha");
            }

            alert("Senha atualizada com sucesso!");
            setStep(1);
            setEmail("");
            setNewPassword("");
            setResetToken("");
            window.location.href = "/login";
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center h-[400px] justify-center bg-gray-900 p-4 rounded-md">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                    {step === 1 ? "Recuperar Senha" : "Atualizar Senha"}
                </h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                {step === 1 ? (
                    <div className="space-y-4">
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="E-mail"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                        <button
                            onClick={handleRequestReset}
                            className="w-full bg-yellow-500 text-white py-2 rounded-md font-bold hover:bg-yellow-600 transition duration-300"
                        >
                            Enviar Link de Redefinição
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3 text-gray-500" />
                            <input
                                type="text"
                                value={resetToken}
                                onChange={(e) => setResetToken(e.target.value)} // Novo campo para o token
                                placeholder="Token de Redefinição"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        <div className="relative">
                            <FaLock className="absolute left-3 top-3 text-gray-500" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nova Senha"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        <button
                            onClick={handleUpdatePassword}
                            className="w-full bg-yellow-500 text-white py-2 rounded-md font-bold hover:bg-yellow-600 transition duration-300"
                        >
                            Atualizar Senha
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
