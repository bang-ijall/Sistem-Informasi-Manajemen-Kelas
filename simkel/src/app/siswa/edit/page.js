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
  const nisn = params.get("nisn");

  const [data, setData] = useState({
    nisn: "",
    nama: "",
    kelas: "",
    hp: "",
    nama_wali: "",
    hp_wali: "",
    tahun_masuk: "",
  });

  const [kelas, setKelas] = useState([])

  useEffect(() => {
    async function fetchSiswa() {
      if (!nisn) return;
      const res = await fetch(`/api/v1/admin/siswa/${nisn}`);
      const data = await res.json();

      if (!data.error) {
        const { id, ...rest } = data.data
        setData({ ...rest })
      } else {
        router.push("/siswa")
      }
    }

    async function fetchKelas() {
      const res = await fetch("/api/v1/admin/kelas")
      const data = await res.json()

      if (!data.error) {
        setKelas(data.data)
      }
    }

    fetchKelas();
    fetchSiswa();
  }, [nisn]);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = nisn ? "PATCH" : "POST";

    try {
      const res = await fetch(`/api/v1/admin/siswa/${nisn || ""}`, {
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
        router.push("/siswa")
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
        onClick={() => router.push("/siswa")}
        className="flex items-center mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
      >
        ← Back
      </button>

      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4">
          {nisn ? "Edit Siswa" : "Tambah Siswa"}
        </h2>

        {/* kalau edit tapi data belum siap → jangan render form */}
        {nisn && !data.nisn ? (
          <div>Loading data siswa...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(data).map((key) => (
              <div key={key}>
                <label className="block text-gray-700 mb-1 capitalize">
                  {key.replace("_", " ")}
                </label>
                {key == "kelas" ? (
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
              {nisn ? "Update" : "Tambah"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
