export default function Navbar() {
  return (
    <header className="flex items-center justify-between h-16 px-8 border-b shadow-sm bg-grey">
      <h1 className="text-lg font-semibold text-white-800"></h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-white-600">Halo, Admin</span>
        <button className="px-4 py-2 text-sm bg-green-600 rounded-lg shadow hover:bg-green-700 text-grey">
          Logout
        </button>
      </div>
    </header>
  );
}
