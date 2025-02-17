"use client";

import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react"; // Importamos useCallback

export default function VerifyEmailPage() {

    const [token, setToken] = useState<string>(""); // Especificamos el tipo de estado
    const [verified, setVerified] = useState<boolean>(false); // Especificamos el tipo de estado
    const [error, setError] = useState<boolean>(false); // Especificamos el tipo de estado

    // Utilizamos useCallback para evitar que la función se redefina innecesariamente
    const verifyUserEmail = useCallback(async () => {
        try {
            await axios.post('/api/users/verifyemail', {token});
            setVerified(true);
        } catch (error: unknown) {
            setError(true);
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
            } else {
                console.log(error);
            }
        }
    }, [token]); // Dependencia en token para que se actualice cuando el token cambie

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token, verifyUserEmail]); // Agregamos verifyUserEmail como dependencia

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl">Verify Email</h1>
            <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2>

            {verified && (
                <div>
                    <h2 className="text-2xl">Email Verified</h2>
                    <Link href="/login">
                        Login
                    </Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="text-2xl bg-red-500 text-black">Error</h2>
                </div>
            )}
        </div>
    );
}
