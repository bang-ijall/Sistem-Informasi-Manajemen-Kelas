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
    kelas: "",
    guru: "",
    pelajaran: "",
    hari: "",
    jam_mulai: "",
    jam_selesai: "",
  });

  const [kelas, setKelas] = useState([]);
  const [guru, setGuru] = useState([]);
  const [pelajaran, setPelajaran] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRoster() {
      if (!id) return;
      setLoading(true);
      const res = await fetch(`/api/v1/admin/roster/${id}`);
      const result = await res.json();

      if (!result.error) {
        const { id: _, ...rest } = result.data;
        setData(rest);
      } else {
        router.push("/roster");
      }
      setLoading(false);
    }

    async function fetchKelas() {
      const res = await fetch("/api/v1/admin/kelas");
      const result = await res.json();
      if (!result.error) setKelas(result.data);
    }

    async function fetchGuru() {
      const res = await fetch("/api/v1/admin/guru");
      const result = await res.json();
      if (!result.error) setGuru(result.data);
    }

    async function fetchPelajaran() {
      const res = await fetch("/api/v1/admin/pelajaran");
      const result = await res.json();
      if (!result.error) setPelajaran(result.data);
    }

    fetchKelas();
    fetchGuru();
    fetchPelajaran();
    fetchRoster();
  }, [id]);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = id ? "PATCH" : "POST";

    try {
      const res = await fetch(`/api/v1/admin/roster/${id || ""}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.error) {
        Swal.fire("Berhasil!", "Data berhasil disimpan", "success");
        router.push("/roster");
      } else {
        Swal.fire("Gagal!", result.message, "error");
      }
    } catch (err) {
      Swal.fire("Error!", "Terjadi kesalahan tak terduga", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => router.push("/roster")}
        className="flex items-center mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
      >
        ← Back
      </button>

      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4">
          {id ? "Edit Roster" : "Tambah Roster"}
        </h2>

        {loading ? (
          <div>Loading data roster...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Kelas */}
            <div>
              <label className="block text-gray-700 mb-1">Kelas</label>
              <select
                value={data.kelas}
                onChange={(e) => handleChange("kelas", e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="" disabled>
                  Pilih kelas
                </option>
                {kelas.map((k) => (
                  <option key={k.kode} value={k.kode}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Guru */}
            <div>
              <label className="block text-gray-700 mb-1">Guru</label>
              <select
                value={data.guru}
                onChange={(e) => handleChange("guru", e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="" disabled>
                  Pilih guru
                </option>
                {guru.map((g) => (
                  <option key={g.nip} value={g.nip}>
                    {g.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Pelajaran */}
            <div>
              <label className="block text-gray-700 mb-1">Pelajaran</label>
              <select
                value={data.pelajaran}
                onChange={(e) => handleChange("pelajaran", e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="" disabled>
                  Pilih pelajaran
                </option>
                {pelajaran.map((p) => (
                  <option key={p.kode} value={p.kode}>
                    {p.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Hari */}
            <div>
              <label className="block text-gray-700 mb-1">Hari</label>
              <select
                value={data.hari}
                onChange={(e) => handleChange("hari", e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="" disabled>
                  Pilih hari
                </option>
                {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Jam Mulai */}
            <div>
              <label className="block text-gray-700 mb-1">Jam Mulai</label>
              <input
                type="time"
                value={data.jam_mulai}
                onChange={(e) => handleChange("jam_mulai", e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            {/* Jam Selesai */}
            <div>
              <label className="block text-gray-700 mb-1">Jam Selesai</label>
              <input
                type="time"
                value={data.jam_selesai}
                onChange={(e) => handleChange("jam_selesai", e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {id ? "Update" : "Tambah"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}