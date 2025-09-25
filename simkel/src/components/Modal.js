"use client";
import { useState } from "react";

export default function Modal({ onClose, onSubmit }) {
  const [nama, setNama] = useState("");
  const [nisn, setNisn] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nama, nisn });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Tambah Data</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="NISN"
            value={nisn}
            onChange={(e) => setNisn(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
