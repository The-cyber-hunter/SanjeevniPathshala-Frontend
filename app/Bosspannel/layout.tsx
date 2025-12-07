"use client";

import Sidebar from "../../components/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}
