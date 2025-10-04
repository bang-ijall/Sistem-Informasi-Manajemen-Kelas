"use client"

import React, { useState } from "react"
import Link from "next/link"
import { LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
)
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.684v.005zM18.75 6.75a4.125 4.125 0 11-8.25 0 4.125 4.125 0 018.25 0z" />
    </svg>
)
const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.375-2.158 2.375h-12.184c-1.194 0-2.158-1.062-2.158-2.375V14.15M12 7.5v9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12H20.25M12 3.75v.008" />
    </svg>
)
// const UserCogIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
// )
const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
)
const LibraryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
)
const ClipboardListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
)
const SchoolIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600 dark:text-indigo-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.07.002z" />
    </svg>
)

const navItems = [
    { name: "Dashboard", path: "/", icon: <HomeIcon /> },
    { name: "Siswa", path: "/siswa", icon: <UsersIcon /> },
    { name: "Guru", path: "/guru", icon: <BriefcaseIcon /> },
    // { name: "User", path: "/user", icon: <UserCogIcon /> },
    { name: "Pelajaran", path: "/pelajaran", icon: <BookOpenIcon /> },
    { name: "Kelas", path: "/kelas", icon: <LibraryIcon /> },
    { name: "Roster", path: "/roster", icon: <ClipboardListIcon /> },
]

export default function Sidebar({ nama, email, foto }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/login")
    }

    const linkClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
    const inactiveClasses = "text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
    const activeClasses = "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow lg:hidden dark:bg-gray-800"
            >
                {/* Hamburger icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5" />
                </svg>
            </button>
            <aside className={`fixed flex flex-col transform flex-shrink-0 inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 dark:bg-gray-950 dark:border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-800">
                    <SchoolIcon />
                    <span className="ml-3 text-lg font-semibold text-gray-800 dark:text-white">SiKel</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}
                            >
                                <span className="w-6 h-6">{item.icon}</span>
                                <span className="ml-3">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <img className="object-cover w-10 h-10 rounded-full" src={foto ?? "https://picsum.photos/100"} alt="Admin user avatar" />
                        <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-800 dark:text-white">{nama}</p> <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5 text-[#ff0000]" />
                    </button>
                </div>
            </aside>

            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}