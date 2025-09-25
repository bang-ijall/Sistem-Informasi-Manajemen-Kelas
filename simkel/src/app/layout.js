"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import "@/app/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-[#F9FAFB] text-gray-900 font-sans">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 p-8 overflow-y-scroll">{children}</div>
        </main>
      </body>
    </html>
  );
}
