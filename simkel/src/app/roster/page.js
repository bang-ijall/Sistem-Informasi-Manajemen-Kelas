"use client";
import React from "react"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function RosterPage() {
  const router = useRouter();
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const fetchRoster = async () => {
    try {
      const res = await fetch("/api/v1/admin/roster");
      const data = await res.json();

      if (data.error) {
        setMessage(data.message);
      } else {
        setRoster(data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const columns = ["guru", "pelajaran", "hari", "jam_mulai", "jam_selesai"];

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Info!",
      text: "Data yang sudah dihapus tidak bisa dikembalikan. Yakin ingin menghapus?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/v1/admin/roster/${id}`, {
          method: "DELETE",
        });
        const result = await res.json();

        if (!result.error) {
          Swal.fire("Berhasil!", "Data berhasil dihapus.", "success");
          fetchRoster(); // refresh data
        } else {
          Swal.fire("Gagal!", result.message, "error");
        }
      } catch (err) {
        Swal.fire("Error!", "Terjadi kesalahan tak terduga", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Roster</h2>
        <button
          onClick={() => router.push("/roster/edit")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          + Tambah
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
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

            {!loading && !error && message && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                  {message}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              Object.entries(roster).map(([kelas, items]) => (
                <React.Fragment key={kelas}>
                  {/* header kelas */}
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="px-6 py-3 text-center font-semibold text-gray-800 bg-gray-50"
                    >
                      {kelas}
                    </td>
                  </tr>

                  {items.map((s) => (
                    <tr key={s.id}>
                      {columns.map((col) => (
                        <td key={col} className="px-6 py-4">
                          {s[col]}
                        </td>
                      ))}
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => router.push(`/roster/edit?id=${s.id}`)}
                          className="px-3 py-1 bg-yellow-400 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
