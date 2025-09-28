"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}

function Component() {
    const router = useRouter();
    const params = useSearchParams();
    const id = params.get("id");

    const [data, setData] = useState({
        id: "",
        ...(id && { password: "" }),
        foto: "",
        role: ""
    })

    const [siswa, setSiswa] = useState([])
    const [guru, setGuru] = useState([])

    useEffect(() => {
        async function fetchUser() {
            if (!id) return;
            const res = await fetch(`/api/v1/admin/user/${id}`);
            const data = await res.json();

            if (!data.error) {
                const user = data.data
                setData({
                    id: user.id,
                    password: user.password,
                    foto: user.foto ? user.foto : "",
                    role: user.role
                })
            } else {
                router.push("/user")
            }
        }

        async function fetchSiswa() {
            const res = await fetch("/api/v1/admin/siswa")
            const data = await res.json()

            if (!data.error) {
                setSiswa(data.data)
            }
        }

        async function fetchGuru() {
            const res = await fetch("/api/v1/admin/guru")
            const data = await res.json()

            if (!data.error) {
                setGuru(data.data)
            }
        }

        fetchSiswa();
        fetchGuru();
        fetchUser();
    }, [id]);

    const handleChange = (key, value) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = id ? "PATCH" : "POST";

        try {
            const res = await fetch(`/api/v1/admin/user/${id || ""}`, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!result.error) {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Data berhasil disimpan",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                router.push("/user")
            } else {
                Swal.fire({
                    title: "Gagal!",
                    text: result.message,
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: "Terjadi kesalahan tak terduga",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <button
                onClick={() => router.push("/user")}
                className="flex items-center px-4 py-2 mb-6 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
                ← Back
            </button>

            <div className="max-w-2xl p-6 mx-auto bg-white border border-gray-100 shadow rounded-xl">
                <h2 className="mb-4 text-2xl font-semibold">
                    {id ? "Edit User" : "Tambah User"}
                </h2>

                {/* kalau edit tapi data belum siap → jangan render form */}
                {id && !data.id ? (
                    <div>Loading data user...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {Object.keys(data).map((key) => (
                            <div key={key}>
                                <label className="block mb-1 text-gray-700 capitalize">
                                    {key.replace("_", " ")}
                                </label>
                                {key == "id" ? (
                                    <select
                                        value={data[key]}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className="w-full px-3 py-2 border rounded"
                                    >
                                        <option value="" disabled>Pilih user</option>
                                        {guru.map((k) => (
                                            <option key={k.nip} value={k.nip}>
                                                {k.nip} - {k.nama}
                                            </option>
                                        ))}
                                        {siswa.map((k) => (
                                            <option key={k.nisn} value={k.nisn}>
                                                {k.nisn} - {k.nama}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={key.includes("hp") ? "tel" : "text"}
                                        placeholder={key.replace("_", " ")}
                                        value={data[key]}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                )}
                            </div>
                        ))}

                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded"
                        >
                            {id ? "Update" : "Tambah"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}