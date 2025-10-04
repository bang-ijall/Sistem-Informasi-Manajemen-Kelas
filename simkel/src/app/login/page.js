"use client"

import React, { useState } from "react"
import Swal from "sweetalert2"

import LoginModal from "@/components/LoginModal"
import LoadingModal from "@/components/LoadingModal"

function Form({ onSubmit }) {
    const required = ["email", "password"]

    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const missing = required.filter((field) => {
            if (field == "foto") {
                return !(form.foto && form.foto_type)
            }

            return !form[field]
        })

        if (missing.length > 0) {
            Swal.fire({
                title: "Data Belum Lengkap",
                text: `Wajib mengisi: ${missing.join(", ")}`,
                icon: "warning",
                confirmButtonText: "OK",
            })

            return
        }

        onSubmit(form)
    }

    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.008 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.008-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )

    const EyeOffIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c1.682 0 3.277-.363 4.695-1.016M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
        </svg>
    )

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-1 gap-4 max-h-[80vh] overflow-y-auto p-1"
        >
            {Object.keys(form).map((field) => {
                return (
                    <div key={field} className="flex flex-col relative">
                        <label className="block mb-1 text-sm font-medium capitalize">
                            {field.replace(/_/g, " ")}:
                        </label>
                        <input
                            type={field == "password" ? (showPassword ? "text" : "password") : "email"}
                            name={field}
                            value={form[field] ?? ""}
                            onChange={(e) => handleChange(field, e.target.value)}
                            className="w-full px-3 py-2 text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 pr-10"
                        />
                        {field === "password" && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 mt-8 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        )}
                    </div>
                )
            })}

            <div className="flex pt-3 space-x-2 col-span-full">
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                    Login
                </button>
            </div>
        </form>
    )
}

export default function Page() {
    const [loading, setLoading] = useState(false)

    const handleLogin = async (form) => {
        setLoading(true)

        try {
            const data = new FormData()

            Object.keys(form).forEach((key) => {
                if (form[key] != undefined && form[key] != null) {
                    data.append(key, form[key])
                }
            })

            const res = await fetch("/api/v1/admin/login", {
                method: "POST",
                body: data
            })

            const body = await res.json()

            if (!body.error) {
                localStorage.setItem("token", body.data)
                window.location.href = "/"
            } else {
                Swal.fire({
                    title: "Gagal!",
                    text: body.message,
                    icon: "error",
                    confirmButtonText: "OK",
                })
            }
        } catch (_) {
            Swal.fire({
                title: "Error!",
                text: "Ada masalah pada server kami. Silahkan coba lagi nanti",
                icon: "error",
                confirmButtonText: "OK",
            })
        }

        setLoading(false)
    }

    return (
        <>
            <LoginModal title={"Login Admin"} >
                <Form onSubmit={handleLogin} />
            </LoginModal>

            <LoadingModal isOpen={loading} text="Sedang mengirim..." />
        </>
    )
}