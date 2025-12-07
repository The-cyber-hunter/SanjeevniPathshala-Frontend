"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Dashboard", path: "/Bosspannel" },
    { name: "Admitted Students", path: "/Bosspannel/students" },
    { name: "Monthly Payments", path: "/Bosspannel/payments" },
  ];

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("adminLoginTime");
      router.push("/login-admin");
    }
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className={`md:hidden fixed top-4 left-4 z-60 text-3xl ${
          open ? "text-white" : "text-purple-700"
        }`}
        onClick={() => setOpen(!open)}
      >
        {open ? <HiX /> : <HiMenu />}
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-purple-700 text-white transition-transform duration-300
          fixed top-0 left-0 h-screen z-50
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:h-auto md:flex md:flex-col
        `}
      >
        <div className="flex flex-col h-full md:h-screen">
          {/* Header */}
          <div className="p-6 text-center border-b border-purple-600">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto mt-6">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link key={link.name} href={link.path}>
                  <div
                    onClick={() => setOpen(false)}
                    className={`px-6 py-3 cursor-pointer hover:bg-purple-600 transition-colors ${
                      isActive ? "bg-purple-800 font-semibold" : ""
                    }`}
                  >
                    {link.name}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-auto w-full p-6 border-t border-purple-600 flex flex-col gap-2">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Logout
            </button>
            <p className="text-sm text-purple-200 text-center">
              © 2025 Sanjeevni Pathshala
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
