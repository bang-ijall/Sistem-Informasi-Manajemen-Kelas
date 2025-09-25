"use client";

export default function Header() {
  return (
    <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
      <div className="font-semibold text-xl">Dashboard</div>
      <button className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
        Logout
      </button>
    </header>
  );
}
