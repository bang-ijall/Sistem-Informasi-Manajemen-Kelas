export default function Card({ title, value }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
      <h2 className="text-sm text-gray-500">{title}</h2>
      <p className="mt-2 text-2xl font-bold text-teal-600">{value}</p>
    </div>
  );
}
