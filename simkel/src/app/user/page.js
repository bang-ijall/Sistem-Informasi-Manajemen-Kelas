"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";

function getPassword(id, length = 12) {
    const hmac = CryptoJS.HmacSHA256(id, "SiSeko_Key");
    const pw = CryptoJS.enc.Base64.stringify(hmac)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    return pw.slice(0, length);
}

export default function UserPage() {
    const router = useRouter();
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("")

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/v1/admin/user", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to fetch user")
            const data = await res.json()

            if (data.error) {
                setMessage(data.message);
            } else {
                setUser(data.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const columns = user.length > 0 ? Object.keys(user[0]) : [];

    const handleShare = async (id) => {
        const res = await fetch(`/api/v1/admin/user/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch user")
        const data = await res.json()

        if (!data.error) {
            if (data.data.role == "guru") {
                const siswa = await fetch(`api/v1/admin/guru/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })

                if (!siswa.ok) throw new Error("Failed to fetch siswa")
                const user = await siswa.json()

                if (!user.error) {
                    // isi pesan yang mau dikirim
                    const message = `Halo ${user.data.nama}, 
akun kamu sudah dibuat. 
ID: ${data.data.id}
Password: ${getPassword(data.data.id)}`;
                    // encode biar aman di URL
                    const encodedMessage = encodeURIComponent(message);

                    // buka WhatsApp Web atau App
                    window.open(`https://api.whatsapp.com/send/?phone=${user.hp}&text=${encodedMessage}&type=phone_number&app_absent=0`, "_blank");
                }
            }
        } else {
            Swal.fire("Error!", "Terjadi kesalahan tak terduga", "error");
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Info!",
            text: "Data yang sudah dihapus tidak bisa dikembalikan. Yakin ingin menghapus?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`/api/v1/admin/user/${id}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                    });

                    const result = await res.json();

                    if (!result.error) {
                        Swal.fire("Berhasil!", "Data berhasil dihapus.", "success")
                            .then(() => window.location.reload());
                    } else {
                        Swal.fire("Gagal!", result.message, "error");
                    }
                } catch (err) {
                    Swal.fire("Error!", "Terjadi kesalahan tak terduga", "error");
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Siswa</h2>
                <button
                    onClick={() => router.push("/user/edit")}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
                >
                    + Tambah
                </button>
            </div>

            <div className="overflow-x-auto bg-white border border-gray-100 shadow rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase"
                                >
                                    {col.replace("_", " ").toUpperCase()}
                                </th>
                            ))}
                            <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading && (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {error && !loading && (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-red-500">
                                    Error: {error}
                                </td>
                            </tr>
                        )}
                        {!loading && !error && message != "" && (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                                    {message}
                                </td>
                            </tr>
                        )}
                        {!loading && !error && user.map((s) => (
                            <tr key={s.id}>
                                {columns.map((col) => (
                                    <td key={col} className="px-6 py-4">{s[col]}</td>
                                ))}
                                <td className="px-6 py-4 space-x-2">
                                    <button
                                        onClick={(e) => handleShare(s.id)}
                                        className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700">Bagikan
                                    </button>
                                    <button
                                        onClick={() => router.push(`/user/edit?id=${s.id}`)}
                                        className="px-3 py-1 text-white bg-yellow-400 rounded">Edit
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(s.id)}
                                        className="px-3 py-1 text-white bg-red-500 rounded">Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
