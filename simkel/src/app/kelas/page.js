"use client"

import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"

import PageHeader from "@/components/PageHeader"
import Modal from "@/components/Modal"
import DataTable from "@/components/DataTable"
import LoadingModal from "@/components/LoadingModal"

function Form({ data, onSubmit, onClose }) {
    const required = ["kode", "nama"]

    const [form, setForm] = useState({
        kode: "",
        nama: ""
    })

    useEffect(() => {
        if (data != null) {
            setForm({
                kode: data.kode,
                nama: data.nama
            })
        }
    }, [data])

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const missing = required.filter((field) => {
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

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-1"
        >
            {Object.keys(form).map((field) => {
                const isRequired = required.includes(field);

                return (
                    <div key={field} className="flex flex-col">
                        <label className="block mb-1 text-sm font-medium capitalize">
                            {field.replace(/_/g, " ")}
                            {isRequired && <span className="ml-1 text-red-500">*</span>}
                        </label>

                        <input
                            type="text"
                            name={field}
                            value={form[field] ?? ""}
                            onChange={(e) => handleChange(field, e.target.value)}
                            required={isRequired}
                            className="w-full px-3 py-2 text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                        />
                    </div>
                );
            })}

            <div className="flex justify-end pt-3 space-x-2 col-span-full">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-black bg-gray-200 rounded hover:bg-gray-300"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                    Simpan
                </button>
            </div>
        </form>
    )
}

export default function Page() {
    const [kelas, setKelas] = useState([])
    const [field, setField] = useState([])
    const [loading, setLoading] = useState(true)
    const [openPopup, setOpenPopup] = useState(false)
    const [edit, setEdit] = useState(null)
    const [posting, setPosting] = useState(false)

    const fetchAPI = async (token) => {
        setLoading(true)
        var message = ""

        try {
            const res = await fetch("/api/v1/admin/kelas", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const body = await res.json()
            message = body.message

            if (!body.error) {
                setKelas(body.data)

                if (body.data.length > 0) {
                    setField(Object.keys(body.data[0]).filter((f) => f != "guru"))
                }

                setLoading(false)
                return
            }
        } catch (_) {
            message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
        }

        if (message == "Unauthorized") {
            window.location.href = "/login"
            return
        }

        setLoading(false)
        Swal.fire({
            title: "Error!",
            text: message,
            icon: "error",
            confirmButtonText: "OK",
        }).then(() => {
            window.location.reload()
        })
    }

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (token) {
            fetchAPI(token)
        } else {
            window.location.href = "/login"
        }
    }, [])

    const handleSimpan = async (form) => {
        setPosting(true)
        const token = localStorage.getItem("token")

        try {
            const method = edit ? "PATCH" : "POST"
            const data = new FormData()

            Object.keys(form).forEach((key) => {
                if (form[key] != undefined && form[key] != null) {
                    data.append(key, form[key])
                }
            })

            const res = await fetch(edit ? `/api/v1/admin/kelas/${edit.kode}` : "/api/v1/admin/kelas", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                method: method,
                body: data
            })

            const body = await res.json()

            if (!body.error) {
                Swal.fire({
                    title: "Berhasil!",
                    text: body.message,
                    icon: "success",
                    confirmButtonText: "OK",
                })

                fetchAPI(token)
                setOpenPopup(false)
                setEdit(null)
            } else {
                if (body.message == "Unauthorized") {
                    window.location.href = "/login"
                    return
                }

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

        setPosting(false)
    }

    const handleHapus = async (kelas) => {
        Swal.fire({
            title: "Peringatan!",
            text: `Data yang sudah dihapus tidak bisa dikembalikan. Yakin ingin menghapus ${kelas.nama}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setPosting(true)
                const token = localStorage.getItem("token")

                try {
                    const res = await fetch(`/api/v1/admin/kelas/${kelas.kode}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        method: "DELETE"
                    })

                    const body = await res.json()

                    if (!body.error) {
                        Swal.fire({
                            title: "Berhasil!",
                            text: body.message,
                            icon: "success",
                            confirmButtonText: "OK",
                        })

                        fetchAPI(token)
                    } else {
                        if (body.message == "Unauthorized") {
                            window.location.href = "/login"
                            return
                        }

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

                setPosting(false)
            }
        })
    }

    const columns = field.map((f) => {
        return {
            header: f.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            accessor: f,
        }
    })

    return (
        <>
            <PageHeader
                title="Kelas"
                description="Kelola data kelas"
                actionButtonText="Tambah Kelas"
                onActionButtonClick={() => setOpenPopup(true)}
            />

            <DataTable
                columns={columns}
                data={kelas}
                onEdit={(item) => {
                    setEdit(item)
                    setOpenPopup(true)
                }}
                onDelete={handleHapus}
            />

            <Modal
                isOpen={openPopup}
                onClose={() => {
                    setOpenPopup(false)
                    setEdit(null)
                }}
                title={edit ? "Edit Kelas" : "Tambah Kelas"}
            >
                <Form
                    fields={field}
                    data={edit}
                    onSubmit={handleSimpan}
                    onClose={() => {
                        setOpenPopup(false)
                        setEdit(null)
                    }}
                />
            </Modal>

            <LoadingModal isOpen={loading} text="Sedang memuat data..." />
            <LoadingModal isOpen={posting} text="Sedang mengirim..." />
        </>
    )
}