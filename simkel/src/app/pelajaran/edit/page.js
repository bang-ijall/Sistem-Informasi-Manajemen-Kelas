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
  const kode = params.get("kode");

  const [data, setData] = useState({
    kode: "",
    nama: "",
    kategori: ""
  });

  useEffect(() => {
    async function fetchPelajaran() {
      if (!kode) return;
      const res = await fetch(`/api/v1/admin/pelajaran/${kode}`);
      const data = await res.json();

      if (!data.error) {
        const { id, ...rest } = data.data
        setData({ ...rest })
      } else {
        router.push("/pelajaran")
      }
    }

    fetchPelajaran();
  }, [kode]);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = kode ? "PATCH" : "POST";

    try {
      const res = await fetch(`/api/v1/admin/pelajaran/${kode || ""}`, {
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
        router.push("/pelajaran")
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
        onClick={() => router.push("/pelajaran")}
        className="flex items-center mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
      >
        ← Back
      </button>

      <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {kode ? "Edit Pelajaran" : "Tambah Pelajaran"}
        </h2>
        {kode && !data.kode ? (
          <div>Loading data pelajaran...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(data).map((key) => (
              <div key={key}>
                <label className="block text-gray-700 mb-1 capitalize">
                  {key.replace("_", " ")}
                </label>
                <input
                  type="text"
                  placeholder={key.replace("_", " ")}
                  value={data[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            ))}

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {kode ? "Update" : "Tambah"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
