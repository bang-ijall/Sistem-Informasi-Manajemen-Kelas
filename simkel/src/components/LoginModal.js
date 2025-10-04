"use client";

import React from "react";

export default function LoginModal({ title, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                className="relative w-1/3 max-w-4xl h-full md:h-auto md:rounded-2xl bg-white dark:bg-gray-900 flex flex-col md:max-h-[90vh] overflow-hidden"
            >
                <div className="flex justify-between items-center px-4 py-3 border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold">{title}</h2>
                </div>

                <div className="p-4 overflow-y-auto flex-1">{children}</div>
            </div>
        </div>
    );
}
