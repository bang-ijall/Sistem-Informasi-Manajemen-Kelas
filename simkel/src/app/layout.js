"use client";

import "@/app/globals.css";

import { usePathname } from "next/navigation"
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import jwt from "jsonwebtoken"

export default function Layout({ children }) {
    const [user, setUser] = useState({})
    const pathname = usePathname()
    const exclude = ["/login"]

    const isNotShow = exclude.includes(pathname)

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (!token && !isNotShow) {
            window.location.href = "/login"
        } else {
            setUser(jwt.decode(token))
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