"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

export default function TambahGuru() {
  const router = useRouter();
  const params = useSearchParams();
  const nip = params.get("nip");

  const [data, setData] = useState({
    nip: "",
    nama: "",
    hp: "",
    kelas: "",
    pelajaran: ""
  });

  const [kelas, setKelas] = useState([])
  const [pelajaran, setPelajaran] = useState([])

  useEffect(() => {
    async function fetchGuru() {
      if (!nip) return;
      const res = await fetch(`/api/v1/admin/guru/${nip}`);
      const data = await res.json();

      if (!data.error) {
        const { id, ...rest } = data.data
        setData({ ...rest })
      } else {
        router.push("/guru")
      }
    }

    async function fetchKelas() {
      const res = await fetch("/api/v1/admin/kelas")
      const data = await res.json()

      if (!data.error) {
        setKelas(data.data)
      }
    }

    async function fetchPelajaran() {
      const res = await fetch("/api/v1/admin/pelajaran")
      const data = await res.json()

      if (!data.error) {
        setPelajaran(data.data)
      }
    }

    fetchKelas();
    fetchPelajaran()
    fetchGuru();
  }, [nip]);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = nip ? "PATCH" : "POST";

    try {
      const res = await fetch(`/api/v1/admin/guru/${nip || ""}`, {
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
        router.push("/guru")
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
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => router.push("/guru")}
        className="flex items-center mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
      >
        ← Back
      </button>

      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {nip ? "Edit Guru" : "Tambah Guru"}
        </h2>
        {nip && !data.nip ? (
          <div>Loading data guru...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(data).map((key) => (
              <div key={key}>
                <label className="block text-gray-700 mb-1 capitalize">
                  {key.replace("_", " ")}
                </label>
                {key === "kelas" ? (
                  <select
                    value={data[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value="" disabled>Pilih kelas</option>
                    {kelas.map((k) => (
                      <option key={k.kode} value={k.kode}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                ) : key === "pelajaran" ? (
                  <select
                    value={data[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value="" disabled>Pilih pelajaran</option>
                    {pelajaran.map((p) => (
                      <option key={p.kode} value={p.kode}>
                        {p.nama}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={key.includes("hp") ? "tel" : "text"}
                    placeholder={key.replace("_", " ")}
                    value={data[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {nip ? "Update" : "Tambah"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
