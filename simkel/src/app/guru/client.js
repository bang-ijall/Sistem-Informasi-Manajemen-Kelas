"use client"

import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"

import PageHeader from "@/components/PageHeader"
import Modal from "@/components/Modal"
import DataTable from "@/components/DataTable"
import LoadingModal from "@/components/LoadingModal"
import { getPassword } from "../api/utils"

function Form({ data, kelas, pelajaran, onSubmit, onClose }) {
    const required = ["nip", "nama", "foto", "hp", "pelajaran"]

    const [form, setForm] = useState({
        nip: "",
        nama: "",
        foto: "",
        hp: "",
        kelas: null,
        pelajaran: "",
        foto_type: ""
    })

    useEffect(() => {
        if (data != null) {
            setForm({
                nip: data.nip,
                nama: data.nama,
                foto: data.foto,
                hp: data.hp,
                kelas: data.class,
                pelajaran: data.lesson,
                foto_type: "url"
            })
        }
    }, [data])

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

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-1"
        >
            {Object.keys(form)
                .filter((i) => i !== "foto_type" && i !== "foto_preview")
                .map((field) => {
                    const isRequired = required.includes(field);

                    return (
                        <div key={field} className="flex flex-col">
                            <label className="block mb-1 text-sm font-medium capitalize">
                                {field.replace(/_/g, " ")}
                                {isRequired && <span className="ml-1 text-red-500">*</span>}
                            </label>

                            {field === "foto" ? (
                                <div className="space-y-2">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">URL Foto</label>
                                        <input
                                            type="text"
                                            value={form.foto_type === "url" ? form.foto : ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                handleChange("foto", val);
                                                handleChange("foto_type", val ? "url" : "");
                                            }}
                                            disabled={form.foto_type === "file"}
                                            className={`w-full rounded-md border px-3 py-2 text-sm transition ${form.foto_type === "file"
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
                                                }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Upload Foto</label>
                                        <div className="flex items-center gap-3">
                                            <label
                                                className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition cursor-pointer ${form.foto_type === "url"
                                                    ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                                    }`}
                                            >
                                                Pilih File
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    disabled={form.foto_type === "url"}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            handleChange("foto", file);
                                                            handleChange("foto_type", "file");
                                                            handleChange("foto_preview", URL.createObjectURL(file));
                                                            e.target.value = "";
                                                        }
                                                    }}
                                                />
                                            </label>

                                            {form.foto_type === "file" && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleChange("foto", "");
                                                        handleChange("foto_type", "");
                                                        handleChange("foto_preview", "");
                                                    }}
                                                    className="px-3 py-2 text-sm text-white transition bg-red-500 rounded-md hover:bg-red-600"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {(form.foto_type === "url" && form.foto) || form.foto_type === "file" ? (
                                        <div className="mt-2">
                                            <img
                                                src={form.foto_type === "file" ? form.foto_preview : form.foto}
                                                alt="Preview"
                                                className="object-cover w-24 h-24 border rounded-md shadow-sm"
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            ) : field.includes("kelas") ? (
                                <select
                                    name={field}
                                    value={form[field] ?? ""}
                                    onChange={(e) => handleChange(field, e.target.value)}
                                    required={isRequired}
                                    className="w-full px-3 py-2 text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <option value="">Pilih kelas</option>
                                    {kelas.map((k) => (
                                        <option key={k.kode} value={k.kode} disabled={!k.kosong}>
                                            {k.kode + " - " + k.nama}
                                        </option>
                                    ))}
                                </select>
                            ) : field.includes("pelajaran") ? (
                                <select
                                    name={field}
                                    value={form[field] ?? ""}
                                    onChange={(e) => handleChange(field, e.target.value)}
                                    required={isRequired}
                                    className="w-full px-3 py-2 text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <option value="">Pilih pelajaran</option>
                                    {pelajaran.map((p) => (
                                        <option key={p.kode} value={p.kode}>
                                            {p.kode + " - " + p.nama}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name={field}
                                    value={form[field] ?? ""}
                                    onChange={(e) => handleChange(field, e.target.value)}
                                    required={isRequired}
                                    className="w-full px-3 py-2 text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                                />
                            )}
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

export default function Page({ guru, kelas, pelajaran, field }) {
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

            const res = await fetch(edit ? `/api/v1/admin/guru/${edit.nip}` : "/api/v1/admin/guru", {
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

    const handleHapus = async (guru) => {
        Swal.fire({
            title: "Peringatan!",
            text: `Data yang sudah dihapus tidak bisa dikembalikan. Yakin ingin menghapus ${guru.nama}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true)
                const token = localStorage.getItem("token")

                try {
                    const res = await fetch(`/api/v1/admin/guru/${guru.nip}`, {
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

    const handleShare = async (user) => {
        const message = encodeURIComponent(`Halo ${user.nama},\nakun kamu sudah dibuat.\n\nID: ${user.nip}\nPassword: ${getPassword(user.nip)}`)

        var hp = user.hp

        if (hp.startsWith("0")) {
            hp = "62" + hp.substring(1);
        }

        window.open(`https://api.whatsapp.com/send/?phone=${hp}&text=${message}&type=phone_number&app_absent=0`, "_blank")
    }

    const columns = field.map((f) => {
        if (f == "foto" && field[f] != "-") {
            return {
                header: "Foto",
                accessor: (row) => {
                    if (!row[f] || row[f] === "-") {
                        return <span className="italic text-gray-400">Tidak ada foto</span>
                    }

                    return (
                        <div className="w-12 h-12 overflow-hidden rounded-md">
                            <img
                                src={row[f]}
                                alt="Foto guru"
                                className="object-cover w-full h-full"
                                onClick={() => Swal.fire({
                                    imageUrl: row[f],
                                    imageAlt: "Foto guru",
                                    showConfirmButton: false,
                                })}
                            />
                        </div>
                    )
                }
            }
        }

        return {
            header: f.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            accessor: f,
        }
    })

    return (
        <>
            <PageHeader
                title="Guru"
                description="Kelola data guru"
                actionButtonText="Tambah Guru"
                onActionButtonClick={() => setOpenPopup(true)}
            />

            <DataTable
                columns={columns}
                data={guru}
                onEdit={(item) => {
                    setEdit(item)
                    setOpenPopup(true)
                }}
                onDelete={handleHapus}
                onShare={handleShare}
            />

            <Modal
                isOpen={openPopup}
                onClose={() => {
                    setOpenPopup(false)
                    setEdit(null)
                }}
                title={edit ? "Edit Guru" : "Tambah Guru"}
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