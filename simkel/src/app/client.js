"use client"

import React, { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import Swal from "sweetalert2"

function AnimatedNumber({ value }) {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        const startValue = displayValue
        const endValue = parseInt(value, 10)
        if (isNaN(endValue)) return

        const duration = 1000
        const startTime = performance.now()

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            const current = Math.floor(startValue + (endValue - startValue) * eased)
            setDisplayValue(current)
            if (progress < 1) requestAnimationFrame(animate)
        }

        requestAnimationFrame(animate)
    }, [value])

    return <span>{displayValue.toLocaleString()}</span>
}

function StatCard({ title, value, icon }) {
    return (
        <div className="flex items-center justify-between p-6 transition-transform duration-300 bg-white rounded-lg shadow-md dark:bg-gray-950 hover:scale-105">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    <AnimatedNumber value={value} />
                </p>
            </div>
            <div className="p-3 text-indigo-500 bg-indigo-100 rounded-full dark:text-indigo-400 dark:bg-indigo-900/50">
                {icon}
            </div>
        </div>
    )
}

// 🧭 Ikon-ikon
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.684v.005zM18.75 6.75a4.125 4.125 0 11-8.25 0 4.125 4.125 0 018.25 0z" />
    </svg>
)
const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.375-2.158 2.375h-12.184c-1.194 0-2.158-1.062-2.158-2.375V14.15M12 7.5v9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12H20.25M12 3.75v.008" />
    </svg>
)
const LibraryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
)
const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
)
const ClipboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h2.5a2 2 0 004 0H15a2 2 0 012 2v16z" />
    </svg>
)
const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M19.5 9.75l-7.5-7.5-7.5 7.5m15 0V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V9.75" />
    </svg>
)
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M4 21h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)

function ActivityChart({ data }) {
    return (
        <div className="p-6 mt-10 bg-white rounded-lg shadow-md dark:bg-gray-950">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Aktivitas Mingguan</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="nama" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tugas" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="kehadiran" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default function Page({ data }) {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Selamat datang, Admin! Berikut rangkuman untuk Anda.
            </p>

            <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Siswa" value={data.siswa} icon={<UsersIcon />} />
                <StatCard title="Total Guru" value={data.guru} icon={<BriefcaseIcon />} />
                <StatCard title="Total Kelas" value={data.kelas} icon={<LibraryIcon />} />
                <StatCard title="Total Pelajaran" value={data.pelajaran} icon={<BookOpenIcon />} />
                <StatCard title="Total Tugas" value={data.tugas} icon={<ClipboardIcon />} />
                <StatCard title="Total Materi" value={data.materi} icon={<DocumentIcon />} />
                <StatCard title="Kehadiran Hari Ini" value={data.kehadiran} icon={<CalendarIcon />} />
            </div>

            {/* Grafik Aktivitas */}
            <ActivityChart data={data.aktivitas_mingguan} />

            {/* Daftar Tugas & Materi */}
            <div className="grid grid-cols-1 gap-6 mt-10 lg:grid-cols-2">
                <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-950">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Tugas Terbaru</h2>
                    <ul className="space-y-3">
                        {data.tugas_baru.map((t) => (
                            <li key={t.id} className="flex items-center justify-between">
                                <span>{t.judul} dari {t.guru} di kelas {t.kelas}</span>
                                <span className="text-sm text-gray-500">{t.tanggal}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-950">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Materi Terbaru</h2>
                    <ul className="space-y-3">
                        {data.materi_baru.map((m) => (
                            <li key={m.id} className="flex items-center justify-between">
                                <span>{m.judul} dari {m.guru} di kelas {m.kelas}</span>
                                <span className="text-sm text-gray-500">{m.tanggal}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
