"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Siswa", path: "/siswa" },
  { name: "Guru", path: "/guru" },
  { name: "User",  path: "/user" },
  { name: "Kelas", path: "/kelas" },
  { name: "Pelajaran", path: "/pelajaran" },
  { name: "Roster", path: "/roster" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1E293B] text-gray-200 shadow-lg flex flex-col">
      <div className="p-6 text-2xl font-bold text-white tracking-wide border-b border-gray-700">
        Edu<span className="text-blue-400">Admin</span>
      </div>
      <nav className="flex flex-col p-4 space-y-2 flex-1">
        {menu.map((item, idx) => (
          <Link
            key={idx}
            href={item.path}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              pathname === item.path
                ? "bg-blue-600 text-white shadow"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        © 2025 EduAdmin
      </div>
    </aside>
  );
}
