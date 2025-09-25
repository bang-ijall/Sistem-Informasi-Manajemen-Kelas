"use client";
import { useState } from "react";
import ModalForm from "./ModalForm";

export default function DataTable({ title, columns, initialData }) {
  const [data, setData] = useState(initialData || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleAdd = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item, idx) => {
    setEditItem({ item, idx });
    setIsModalOpen(true);
  };

  const handleDelete = (idx) => {
    setData(data.filter((_, i) => i !== idx));
  };

  const handleSave = (item) => {
    if (editItem) {
      const newData = [...data];
      newData[editItem.idx] = item;
      setData(newData);
    } else {
      setData([...data, item]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={handleAdd}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          + Tambah
        </button>
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th key={col} className="p-2 border">
                {col}
              </th>
            ))}
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="p-4 text-center text-gray-500"
              >
                Tidak ada data
              </td>
            </tr>
          )}
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col} className="p-2 border">
                  {row[col.toLowerCase()]}
                </td>
              ))}
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => handleEdit(row, idx)}
                  className="px-2 py-1 text-xs bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <ModalForm
          columns={columns}
          initial={editItem?.item || {}}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
