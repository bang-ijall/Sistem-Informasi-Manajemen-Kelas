"use client";

export default function LoadingModal({ isOpen = false, text = "Memuat data..." }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="
          relative w-full max-w-sm h-auto 
          md:rounded-2xl bg-white dark:bg-gray-900 
          flex flex-col items-center justify-center
          p-6 space-y-4 shadow-lg
        "
      >
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-gray-700 dark:text-gray-300 text-sm">{text}</p>
      </div>
    </div>
  );
}