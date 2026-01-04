"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface StudentData {
  name: string;
  email: string;
  phone: string;
  class: string;
  monthlyPayments?: { amount: number; date: string }[];
}

/* ✅ CLASS-WISE MONTHLY FEE (DISPLAY ONLY) */
const getMonthlyFee = (studentClass: string): number => {
  const classNumber = parseInt(studentClass.replace(/\D/g, ""));
  if (classNumber >= 1 && classNumber <= 4) return 150;
  if (classNumber >= 5 && classNumber <= 6) return 175;
  if (classNumber >= 7 && classNumber <= 8) return 200;
  if (classNumber >= 9 && classNumber <= 10) return 250;
  return 0;
};

const MonthlyPaymentPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<StudentData>({
    name: "",
    email: "",
    phone: "",
    class: "",
    monthlyPayments: [],
  });
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const monthlyFee = getMonthlyFee(formData.class);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => toast.error("Failed to load Razorpay script.");
    document.body.appendChild(script);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!isRegistered) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  /* ✅ Check if student already paid this month */
  const alreadyPaidThisMonth = (student: StudentData): boolean => {
    const now = new Date();
    return (
      student.monthlyPayments?.some((p) => {
        const d = new Date(p.date);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }) || false
    );
  };

  /* 🔥 UPDATED: CHECK REGISTRATION USING ALL DETAILS */
  const checkRegistration = async (): Promise<boolean> => {
    const { name, email, phone, class: studentClass } = formData;

    if (!name || !email || !phone || !studentClass) {
      toast.error("Please enter all student details.");
      return false;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            class: studentClass,
          }),
        }
      );

      const data = await res.json();

      if (!data.registered) {
        toast.error("Please complete registration first.");
        setIsRegistered(false);
        return false;
      }

      setFormData({
        name: data.student.name,
        email: data.student.email,
        phone: data.student.phone,
        class: data.student.class,
        monthlyPayments: data.student.monthlyPayments || [],
      });

      setIsRegistered(true);

      if (alreadyPaidThisMonth(data.student)) {
        toast.error("You have already paid this month's fee.");
        return false;
      }

      return true;
    } catch (err) {
      toast.error("Failed to verify registration.");
      return false;
    }
  };

  const openRazorpay = async () => {
    if (!razorpayLoaded) {
      toast.error("Razorpay is not loaded yet.");
      return;
    }

    if (!(await checkRegistration())) return;

    const { email, name, phone, class: studentClass } = formData;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            type: "monthly",
            name,
            phone,
            class: studentClass,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create order.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "Sanjeevni Pathshala",
        description: "Monthly Fee",
        handler: () => setPaymentSuccess(true),
        prefill: { name, email, contact: phone },
        theme: { color: "#ec4899" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await openRazorpay();
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-50 via-pink-50 to-purple-50 px-6 text-center">
        <h1 className="text-3xl font-bold text-pink-500 mb-4">
          🎉 Payment Successful!
        </h1>
        <button
          onClick={() => router.push("/")}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 via-pink-50 to-purple-50 px-6">
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 space-y-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-pink-500 text-center">
          Monthly Fee Payment
        </h1>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-black"
        />

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
          className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-black"
        />

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          required
          className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-black"
        />

        <select
          name="class"
          value={formData.class}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-black"
        >
          <option value="">Select Class</option>
          {[...Array(10)].map((_, i) => (
            <option key={i} value={`Class ${i + 1}`}>
              Class {i + 1}
            </option>
          ))}
        </select>

        {monthlyFee > 0 && (
          <p className="text-center font-semibold text-purple-700">
            Monthly Fee: ₹{monthlyFee}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !razorpayLoaded}
          className="bg-pink-500 w-full text-white py-3 rounded-lg"
        >
          {loading ? "Processing..." : `Pay Monthly Fee (₹${monthlyFee})`}
        </button>
      </form>
    </div>
  );
};

export default MonthlyPaymentPage;
