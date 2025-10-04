import React from 'react';
import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="flex h-screen text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}

export default Layout;
