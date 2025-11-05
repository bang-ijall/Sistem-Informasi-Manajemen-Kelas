"use client";

import React from "react"

function EditIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
        </svg>
    );
}

function DeleteIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
        </svg>
    );
}

function ShareIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 12a4.5 4.5 0 014.5-4.5h.75V4.5l6 6-6 6v-3H12a4.5 4.5 0 01-4.5-4.5z"
            />
        </svg>
    )
}

export default function DataTable({ columns = [], data = [], loading = false, onEdit, onDelete, onShare }) {
    return (
        <div className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-950">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
                            >
                                No.
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col.accessor || col.header}
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
                                >
                                    {col.header}
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3 text-xs font-medium text-right text-gray-500 dark:text-gray-400" />
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-950 dark:divide-gray-800">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + 2}
                                    className="px-6 py-6 text-sm text-center text-gray-500 dark:text-gray-400"
                                >
                                    {loading ? "Loading..." : "Tidak ada data"}
                                </td>
                            </tr>
                        ) : (
                            data.map((item, i) => (
                                <tr key={item.id ?? i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap dark:text-gray-300">
                                        {i + 1}
                                    </td>
                                    {columns.map((col) => (
                                        <td
                                            key={col.accessor || col.header}
                                            className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap dark:text-gray-300"
                                        >
                                            {typeof col.accessor === "function"
                                                ? col.accessor(item)
                                                : String(item[col.accessor] ?? "")}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 space-x-4 text-sm font-medium text-right whitespace-nowrap">
                                        {onShare && (
                                            <button
                                                onClick={() => onShare?.(item)}
                                                className="text-green-600 transition-colors hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                            >
                                                <ShareIcon />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onEdit?.(item)}
                                            className="text-indigo-600 transition-colors hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(item)}
                                            className="text-red-600 transition-colors hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}