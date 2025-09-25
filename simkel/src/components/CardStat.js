export default function CardStat({ title, value, icon }) {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
      {icon && <div className="text-blue-500 mr-4">{icon}</div>}
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
