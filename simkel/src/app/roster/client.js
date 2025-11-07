"use client"

import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"

import PageHeader from "@/components/PageHeader"
import Modal from "@/components/Modal"
import DataTable from "@/components/DataTable"
import LoadingModal from "@/components/LoadingModal"
import Cookies from "js-cookie"

function Form({ data, kelas, pelajaran, onSubmit, onClose }) {
    const required = ["kelas", "pelajaran", "hari", "jam_mulai", "jam_selesai"]

    const [form, setForm] = useState({
        id: "",
        class: "",
        kelas: "",
        pelajaran: "",
        hari: "",
        jam_mulai: "",
        jam_selesai: ""
    })

    useEffect(() => {
        if (data != null) {
            setForm({
                kelas: data.class,
                pelajaran: data.teacher,
                hari: data.hari,
                jam_mulai: data.jam_mulai,
                jam_selesai: data.jam_selesai
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
            {Object.keys(form).filter((i) => i != "id" && i != "class").map((field) => {
                const isRequired = required.includes(field);

                return (
                    <div key={field} className="flex flex-col">
                        <label className="block mb-1 text-sm font-medium capitalize">
                            {field.replace(/_/g, " ")}
                            {isRequired && <span className="ml-1 text-red-500">*</span>}
                        </label>

                        {field.includes("kelas") ? (
                            <select
                                name={field}
                                value={form[field] ?? ""}
                                required={isRequired}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className="w-full px-3 py-2 text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                            >
                                <option value="" disabled>Pilih kelas</option>
                                {kelas.map((k) => (
                                    <option key={k.kode} value={k.kode}>
                                        {k.kode + " - " + k.nama}
                                    </option>
                                ))}
                            </select>
                        ) : field.includes("pelajaran") ? (
                            <select
                                name={field}
                                value={form[field] ?? ""}
                                required={isRequired}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className="w-full px-3 py-2 text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                            >
                                <option value="" disabled>Pilih pelajaran</option>
                                {pelajaran.map((k) => (
                                    <option key={k.nip} value={k.nip}>
                                        {k.pelajaran + " - " + k.nama}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                name={field}
                                value={form[field] ?? ""}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className="w-full px-3 py-2 text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                            />
                        )}
                    </div>
                )
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

export default function Page({ roster, kelas, pelajaran, field }) {
    const [loading, setLoading] = useState(false)
    const [openPopup, setOpenPopup] = useState(false)
    const [edit, setEdit] = useState(null)

    const handleSimpan = async (form) => {
        setLoading(true)
        const token = Cookies.get("token")

        try {
            const method = edit ? "PATCH" : "POST"
            const data = new FormData()

            Object.keys(form).forEach((key) => {
                if (form[key] != undefined && form[key] != null) {
                    data.append(key, form[key])
                }
            })

            const res = await fetch(edit ? `/api/v1/admin/roster/${edit.id}` : "/api/v1/admin/roster", {
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

                window.location.href = "/roster"
            } else {
                if (body.message == "Unauthorization") {
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

    const handleHapus = async (roster) => {
        Swal.fire({
            title: "Peringatan!",
            text: `Data yang sudah dihapus tidak bisa dikembalikan. Yakin ingin menghapus ${roster.pelajaran}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true)
                const token = Cookies.get("token")

                try {
                    const res = await fetch(`/api/v1/admin/roster/${roster.id}`, {
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

                        window.location.href = "/roster"
                    } else {
                        if (body.message == "Unauthorization") {
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
                title="Roster"
                description="Kelola data roster"
                actionButtonText="Tambah Roster"
                onActionButtonClick={() => setOpenPopup(true)}
            />

            {
                Object.entries(roster).map(([kelas, items]) => (
                    <div key={kelas} className="mb-6">
                        <h2 className="mb-2 text-lg font-semibold">{kelas}</h2>
                        <DataTable
                            columns={columns}
                            data={items}
                            onEdit={(item) => {
                                setEdit(item)
                                setOpenPopup(true)
                            }}
                            onDelete={handleHapus}
                        />
                    </div>
                ))
            }

            <Modal
                isOpen={openPopup}
                onClose={() => {
                    setOpenPopup(false)
                    setEdit(null)
                }}
                title={edit ? "Edit Roster" : "Tambah Roster"}
            >
                <Form
                    fields={field}
                    data={edit}
                    kelas={kelas}
                    pelajaran={pelajaran}
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
