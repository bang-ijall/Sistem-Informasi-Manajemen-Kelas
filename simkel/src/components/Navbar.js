export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b shadow-sm flex items-center px-8 justify-between">
      <h1 className="font-semibold text-lg text-gray-800"></h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Halo, Admin</span>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow text-sm">
          Logout
        </button>
      </div>
    </header>
  );
}
