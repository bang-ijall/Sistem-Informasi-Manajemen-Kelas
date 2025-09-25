export default function Table({ data, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full">
        <thead className="bg-gray-50 text-gray-600 text-sm">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">NISN</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id}
              className={`border-t ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition`}
            >
              <td className="p-3">{row.id}</td>
              <td className="p-3">{row.nama}</td>
              <td className="p-3">{row.nisn}</td>
              <td className="p-3 text-center space-x-2">
                <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm">
                  Edit
                </button>
                <button
                  onClick={() => onDelete(row.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
