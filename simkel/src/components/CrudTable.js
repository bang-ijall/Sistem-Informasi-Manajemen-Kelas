"use client";
import { useState } from "react";

export default function CrudTable({ title }) {
  const [items, setItems] = useState([]);
  const [formValue, setFormValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleSave = () => {
    if (!formValue.trim()) return;
    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = formValue;
      setItems(updated);
      setEditIndex(null);
    } else {
      setItems([...items, formValue]);
    }
    setFormValue("");
  };

  const handleEdit = (i) => {
    setFormValue(items[i]);
    setEditIndex(i);
  };

  const handleDelete = (i) => {
    setItems(items.filter((_, idx) => idx !== i));
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder={`Tambah ${title}`}
            className="border rounded-lg px-3 py-1 text-sm"
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
          >
            {editIndex !== null ? "Update" : "Tambah"}
          </button>
        </div>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">#</th>
            <th className="p-2 border">{title}</th>
            <th className="p-2 border w-32">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((val, i) => (
            <tr key={i}>
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{val}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => handleEdit(i)}
                  className="px-2 py-1 text-xs bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="3" className="p-3 text-center text-gray-500">
                Belum ada data {title}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
