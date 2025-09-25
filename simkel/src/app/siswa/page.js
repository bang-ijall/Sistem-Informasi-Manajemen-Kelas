"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function SiswaPage() {
  const router = useRouter();
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("")

  const fetchSiswa = async () => {
    try {
      const res = await fetch("/api/v1/admin/siswa", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch siswa");
      const data = await res.json();

      if (data.error) {
        setMessage(data.message);
      } else {
        setSiswa(data.data.map(({ id, ...rest }) => ({ ...rest })));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiswa();
  }, []);

  const columns = siswa.length > 0 ? Object.keys(siswa[0]) : [];

  const handleDelete = async (nisn) => {
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
          const res = await fetch(`/api/v1/admin/siswa/${nisn}`, {
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
          console.log(err);
          Swal.fire("Error!", "Terjadi kesalahan tak terduga", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Siswa</h2>
        <button
          onClick={() => router.push("/siswa/edit")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          + Tambah
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {col.replace("_", " ").toUpperCase()}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
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
            {!loading && !error && siswa.map((s) => (
              <tr key={s.nisn}>
                {columns.map((col) => (
                  <td key={col} className="px-6 py-4">{s[col]}</td>
                ))}
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => router.push(`/siswa/edit?nisn=${s.nisn}`)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded">Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(s.nisn)}
                    className="px-3 py-1 bg-red-500 text-white rounded">Hapus
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
