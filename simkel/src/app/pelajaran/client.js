"use client"

import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"

import PageHeader from "@/components/PageHeader"
import Modal from "@/components/Modal"
import DataTable from "@/components/DataTable"
import LoadingModal from "@/components/LoadingModal"

function Form({ data, onSubmit, onClose }) {
    const required = ["kode", "nama", "kategori"]

    const [form, setForm] = useState({
        kode: "",
        nama: "",
        kategori: ""
    })

    useEffect(() => {
        if (data != null) {
            setForm({
                kode: data.kode,
                nama: data.nama,
                kategori: data.kategori
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

export default function Page({ pelajaran, field }) {
    const [loading, setLoading] = useState(false)
    const [openPopup, setOpenPopup] = useState(false)
    const [edit, setEdit] = useState(null)

    const handleSimpan = async (form) => {
        setLoading(true)
        const token = localStorage.getItem("token")

        try {
            const method = edit ? "PATCH" : "POST"
            const data = new FormData()

            Object.keys(form).forEach((key) => {
                if (form[key] != undefined && form[key] != null) {
                    data.append(key, form[key])
                }
            })

            const res = await fetch(edit ? `/api/v1/admin/pelajaran/${edit.kode}` : "/api/v1/admin/pelajaran", {
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

        setLoading(false)
    }

    const handleHapus = async (pelajaran) => {
        Swal.fire({
            title: "Peringatan!",
            text: `Data yang sudah dihapus tidak bisa dikembalikan. Yakin ingin menghapus ${pelajaran.nama}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true)
                const token = localStorage.getItem("token")

                try {
                    const res = await fetch(`/api/v1/admin/pelajaran/${pelajaran.kode}`, {
                        header: {
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

                setLoading(false)
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
                title="Pelajaran"
                description="Kelola data pelajaran"
                actionButtonText="Tambah Pelajaran"
                onActionButtonClick={() => setOpenPopup(true)}
            />

            <DataTable
                columns={columns}
                data={pelajaran}
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
                title={edit ? "Edit Pelajaran" : "Tambah Pelajaran"}
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

            <LoadingModal isOpen={loading} text="Sedang mengirim..." />
        </>
    )
}