"use client";

import "@/app/globals.css";

import { usePathname } from "next/navigation"
import React, { useState, useEffect } from 'react';
import jwt from "jsonwebtoken"
import Sidebar from "@/components/Sidebar"

export default function Layout({ children }) {
    const [user, setUser] = useState({})
    const pathname = usePathname()
    const exclude = ["/login"]

    const isNotShow = exclude.includes(pathname)

    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1]

        if (!token && !isNotShow) {
            window.location.href = "/login"
            return
        }

        if (token) {
            const decoded = jwt.decode(token)
            setUser(decoded)
        }
    }, [])

    return (
        <html lang="en">
            <body>
                <div className="flex h-screen text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
                    {!isNotShow && (
                        <Sidebar
                            nama={user.nama}
                            email={user.email}
                            foto={user.foto}
                        />
                    )}
                    <main className="flex-1 p-6 overflow-y-auto sm:p-8 lg:p-10">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}