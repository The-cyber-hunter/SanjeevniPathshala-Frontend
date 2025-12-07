"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [totalStudents, setTotalStudents] = useState(0);
  const [notPaidCount, setNotPaidCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  // Track mobile vs desktop for chart labels
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    setLoading(false);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/dashboard`
      );
      const data = await res.json();

      setTotalStudents(data.totalStudents);
      setNotPaidCount(data.notPaidCount);
      setRevenue(data.revenueThisMonth || 0);
      setChartData(data.monthlyStats || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  if (loading) return <p className="p-6 text-black">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-white text-black md:flex-1 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-700 text-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Total Admitted Students</h2>
          <p className="text-4xl font-bold mt-2">{totalStudents}</p>
        </div>

        <div className="bg-red-600 text-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Monthly Fees Not Paid</h2>
          <p className="text-4xl font-bold mt-2">{notPaidCount}</p>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">This Month Revenue</h2>
          <p className="text-4xl font-bold mt-2">₹{revenue}</p>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow mt-10">
        <h2 className="text-2xl font-semibold mb-4">Admitted Students Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: isMobile ? 50 : 20 }}
          >
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#000000", fontSize: 12 }}
              interval={0}
              angle={isMobile ? -30 : 0} // rotate only on mobile
              textAnchor={isMobile ? "end" : "middle"}
            />
            <YAxis tick={{ fill: "#000000" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                color: "#000000",
              }}
            />
            <Bar dataKey="students" fill="#6366f1" minPointSize={5} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
