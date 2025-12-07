"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  status: "paid" | "unpaid";
}

export default function PaymentsPage() {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]); // full data
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7));

  // -------------------------
  // LOGIN PROTECTION + AUTO LOGOUT
  // -------------------------
  useEffect(() => {
    const logged = localStorage.getItem("adminLoggedIn");
    const loginTime = localStorage.getItem("adminLoginTime");

    if (!logged || !loginTime) {
      router.push("/login-admin");
      return;
    }

    const now = new Date().getTime();
    const twoDays = 2 * 24 * 60 * 60 * 1000;

    if (now - parseInt(loginTime) > twoDays) {
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("adminLoginTime");
      router.push("/login-admin");
      return;
    }

    loadPayments();
  }, [monthFilter]);

  // -------------------------
  // FETCH PAYMENTS FROM BACKEND
  // -------------------------
  const loadPayments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/payments?month=${monthFilter}`);
      const data = await res.json();
      setStudents(data.students);
      setAllStudents(data.students); // keep original for filtering
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePayment = async (studentId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/payments/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, month: monthFilter }),
      });

      const data = await res.json();

      if (data.success) {
        setStudents((prev) =>
          prev.map((s) => (s._id === studentId ? { ...s, status: s.status === "paid" ? "unpaid" : "paid" } : s))
        );
        setAllStudents((prev) =>
          prev.map((s) => (s._id === studentId ? { ...s, status: s.status === "paid" ? "unpaid" : "paid" } : s))
        );
      }
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  // -------------------------
  // FILTER LOGIC
  // -------------------------
  const handleClassFilter = (cls: string) => {
    setClassFilter(cls);
    if (cls === "All") {
      setStudents(allStudents);
    } else {
      setStudents(allStudents.filter((s) => s.class === cls));
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.toLowerCase().includes(search.toLowerCase())
  );

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStudents);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, `Payments-${monthFilter}.xlsx`);
  };

  if (loading) return <p className="ml-64 p-6 text-black">Loading...</p>;

  return (
   <div className="p-6 min-h-screen bg-white text-black md:flex-1 md:p-6">
      <h1 className="text-3xl font-bold mb-4 text-black">Monthly Payments</h1>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search name/phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg text-black bg-white"
        />

        <select
          value={classFilter}
          onChange={(e) => handleClassFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg text-black bg-white"
        >
          <option value="All">All Classes</option>
          {[...Array(10)].map((_, i) => {
            const cls = `Class ${i + 1}`;
            return (
              <option key={i} value={cls}>
                {cls}
              </option>
            );
          })}
        </select>

        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg text-black bg-white"
        />

        <button
          onClick={downloadExcel}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
        >
          Download Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-left text-black">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s._id} className="border-b hover:bg-purple-50">
                <td className="py-3 px-4">{s.name}</td>
                <td className="py-3 px-4">{s.class}</td>
                <td className="py-3 px-4">{s.phone}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded text-white ${
                      s.status === "paid" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {s.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => togglePayment(s._id)}
                    className={`px-4 py-1 rounded-lg text-white ${
                      s.status === "paid" ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {s.status === "paid" ? "Mark Unpaid" : "Mark Paid"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <p className="p-4 text-center text-gray-500">No students found.</p>
        )}
      </div>
    </div>
  );
}
