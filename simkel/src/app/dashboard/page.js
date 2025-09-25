"use client";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function DashboardPage() {
  const stats = { siswa: 120, guru: 12, kelas: 8, pelajaran: 15 };

  const barData = {
    labels: ["X-1", "X-2", "XI-1", "XI-2", "XII-1", "XII-2"],
    datasets: [{ label: "Jumlah Siswa", data: [20,18,22,16,25,19], backgroundColor: "#2563EB", borderRadius: 6 }]
  };

  const pieData = {
    labels: ["Matematika","Bahasa Inggris","IPA","IPS","Bahasa Indonesia"],
    datasets: [{ data: [5,3,2,3,2], backgroundColor: ["#2563EB","#3B82F6","#60A5FA","#93C5FD","#BFDBFE"], borderWidth: 1 }]
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Siswa</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">{stats.siswa}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Guru</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">{stats.guru}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Kelas</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">{stats.kelas}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Pelajaran</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">{stats.pelajaran}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Siswa per Kelas</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Pelajaran</h3>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
        </div>
      </div>
    </div>
  );
}
