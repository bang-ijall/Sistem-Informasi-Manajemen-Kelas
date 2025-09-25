export default function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
