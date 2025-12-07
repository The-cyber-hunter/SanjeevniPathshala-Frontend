"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentsPage() {
  const router = useRouter();

  const [students, setStudents] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");

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

    loadStudents();
  }, []);

  // -------------------------
  // FETCH STUDENTS FROM BACKEND
  // -------------------------
  const loadStudents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/students`);
      const data = await res.json();
      setStudents(data.students);
      setAllStudents(data.students); // keep full data for filtering
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
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

  if (loading) return <p className="ml-64 p-6">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-white text-black md:flex-1 md:p-6">
      <h1 className="text-3xl font-bold mb-4 text-black">Admitted Students</h1>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-1/3 text-black bg-white"
        />

        <select
          value={classFilter}
          onChange={(e) => handleClassFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-40 text-black bg-white"
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
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-left text-black">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Admission Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s._id} className="border-b hover:bg-purple-50">
                <td className="py-3 px-4">{s.name}</td>
                <td className="py-3 px-4">{s.email}</td>
                <td className="py-3 px-4">{s.phone}</td>
                <td className="py-3 px-4">{s.class}</td>
                <td className="py-3 px-4">{new Date(s.createdAt).toLocaleDateString()}</td>
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
