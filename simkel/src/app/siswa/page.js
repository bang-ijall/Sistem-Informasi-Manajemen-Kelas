"use client"

import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"

import PageHeader from "@/components/PageHeader"
import Modal from "@/components/Modal"
import DataTable from "@/components/DataTable"
import LoadingModal from "@/components/LoadingModal"
import { getPassword } from "../api/utils"

function Form({ data, kelas, onSubmit, onClose }) {
    const required = ["nisn", "nama", "foto", "hp", "tahun_masuk", "kelas", "nama_wali", "hp_wali"]

    const [form, setForm] = useState({
        nisn: "",
        nama: "",
        foto: "",
        hp: "",
        tahun_masuk: "",
        kelas: "",
        nama_wali: "",
        hp_wali: "",
        foto_type: ""
    })

    useEffect(() => {
        if (data != null) {
            setForm({
                nisn: data.nisn,
                nama: data.nama,
                foto: data.foto,
                hp: data.hp,
                tahun_masuk: data.tahun_masuk,
                kelas: data.class,
                nama_wali: data.nama_wali,
                hp_wali: data.hp_wali,
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
            {Object.keys(form).filter((i) => i != "foto_type" && i != "foto_preview").map((field) => {
                const isRequired = required.includes(field)

                return (
                    <div key={field} className="flex flex-col">
                        <label className="block mb-1 text-sm font-medium capitalize">
                            {field.replace(/_/g, " ")}
                            {isRequired && <span className="ml-1 text-red-500">*</span>}
                        </label>

                        {field == "foto" ? (
                            <div className="space-y-2">
                                <div>
                                    <label className="block mb-1 text-sm font-medium">URL Foto</label>
                                    <input
                                        type="text"
                                        value={form.foto_type == "url" ? form.foto : ""}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            handleChange("foto", val)
                                            handleChange("foto_type", val ? "url" : "")
                                        }}
                                        disabled={form.foto_type == "file"}
                                        className={`w-full rounded-md border px-3 py-2 text-sm transition ${form.foto_type == "file"
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium">Upload Foto</label>
                                    <div className="flex items-center gap-3">
                                        <label
                                            className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition cursor-pointer ${form.foto_type == "url"
                                                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                                                }`}
                                        >
                                            Pilih File
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                disabled={form.foto_type == "url"}
                                                onChange={(e) => {
                                                    const file = e.target.files[0]
                                                    if (file) {
                                                        handleChange("foto", file)
                                                        handleChange("foto_type", "file")
                                                        handleChange("foto_preview", URL.createObjectURL(file))
                                                        e.target.value = ""
                                                    }
                                                }}
                                            />
                                        </label>

                                        {form.foto_type == "file" && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleChange("foto", "")
                                                    handleChange("foto_type", "")
                                                    handleChange("foto_preview", "")
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

export default function Page() {
    const [siswa, setSiswa] = useState([])
    const [field, setField] = useState([])
    const [kelas, setKelas] = useState([])
    const [loading, setLoading] = useState(true)
    const [openPopup, setOpenPopup] = useState(false)
    const [edit, setEdit] = useState(null)
    const [posting, setPosting] = useState(false)

    const fetchAPI = async (token) => {
        setLoading(true)
        var message = ""

        try {
            var res = await fetch("/api/v1/admin/kelas", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            var body = await res.json()
            message = body.message

            if (!body.error) {
                setKelas(body.data)

                res = await fetch("/api/v1/admin/siswa", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })

                body = await res.json()
                message = body.message

                if (!body.error) {
                    setSiswa(body.data)

                    if (body.data.length > 0) {
                        setField(Object.keys(body.data[0]).filter((f) => f != "class"))
                    }

                    setLoading(false)
                    return
                }
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

            const res = await fetch(edit ? `/api/v1/admin/siswa/${edit.nisn}` : "/api/v1/admin/siswa", {
                headers: {
                    Authorization: `Bearer ${token}`,
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

    const handleHapus = async (siswa) => {
        Swal.fire({
            title: "Peringatan!",
            text: `Data yang sudah dihapus tidak bisa dikembalikan. Yakin ingin menghapus ${siswa.nama}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setPosting(true)
                const token = localStorage.getItem("token")

                try {
                    const res = await fetch(`/api/v1/admin/siswa/${siswa.nisn}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
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

    const handleShare = async (user) => {
        const message = encodeURIComponent(`Halo ${user.nama},\nakun kamu sudah dibuat.\n\nID: ${user.nisn}\nPassword: ${getPassword(user.nisn)}`)

        var hp = user.hp

        if (hp.startsWith("0")) {
            hp = "62" + hp.substring(1)
        }

        window.open(`https://api.whatsapp.com/send/?phone=${hp}&text=${message}&type=phone_number&app_absent=0`, "_blank")
    }

    const columns = field.map((f) => {
        if (f == "foto") {
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
                                alt="Foto siswa"
                                className="object-cover w-full h-full"
                                onClick={() => Swal.fire({
                                    imageUrl: row[f],
                                    imageAlt: "Foto siswa",
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
                title="Siswa"
                description="Kelola data siswa"
                actionButtonText="Tambah Siswa"
                onActionButtonClick={() => setOpenPopup(true)}
            />

            <DataTable
                columns={columns}
                data={siswa}
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
                title={edit ? "Edit Siswa" : "Tambah Siswa"}
            >
                <Form
                    fields={field}
                    data={edit}
                    kelas={kelas}
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
