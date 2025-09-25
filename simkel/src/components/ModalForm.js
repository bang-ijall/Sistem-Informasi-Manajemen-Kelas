"use client";
import { useState, useEffect } from "react";

export default function ModalForm({ columns, initial, onSave, onCancel }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    const init = {};
    columns.forEach((col) => {
      init[col.toLowerCase()] = initial[col.toLowerCase()] || "";
    });
    setForm(init);
  }, [columns, initial]);

  const handleChange = (col, value) => {
    setForm((prev) => ({ ...prev, [col.toLowerCase()]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h4 className="text-lg font-semibold mb-4">
          {Object.keys(initial).length ? "Edit Data" : "Tambah Data"}
        </h4>
        <div className="space-y-4">
          {columns.map((col) => (
            <div key={col}>
              <label className="block text-sm font-medium text-gray-700">
                {col}
              </label>
              <input
                type="text"
                value={form[col.toLowerCase()]}
                onChange={(e) => handleChange(col, e.target.value)}
                className="mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
