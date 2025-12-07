"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface StudentData {
  name: string;
  email: string;
  phone: string;
  class: string;
}

const MonthlyPaymentPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<StudentData>({
    name: "",
    email: "",
    phone: "",
    class: "",
  });
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // -----------------------------
  // Load Razorpay script dynamically
  // -----------------------------
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      console.log("✅ Razorpay script loaded");
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      console.error("❌ Failed to load Razorpay script");
      toast.error("Failed to load Razorpay script.");
    };
    document.body.appendChild(script);
  }, []);

  // -----------------------------
  // Handle input changes
  // -----------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!isRegistered) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      console.log("✏️ Input changed:", e.target.name, e.target.value);
    }
  };

  // -----------------------------
  // Check if student is registered
  // -----------------------------
  const checkRegistration = async (): Promise<boolean> => {
    console.log("🔍 Checking registration for:", formData.email);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/status/${formData.email}`
      );
      const data = await res.json();
      console.log("📦 Registration response:", data);

      if (!data.registered) {
        toast.error("Please complete registration first.");
        setIsRegistered(false);
        console.warn("❌ Student not registered");
        return false;
      }

      setFormData({
        name: data.student.name,
        email: data.student.email,
        phone: data.student.phone,
        class: data.student.class,
      });
      setIsRegistered(true);
      return true;
    } catch (err) {
      console.error("❌ Failed to verify registration:", err);
      toast.error("Failed to verify registration.");
      return false;
    }
  };

  // -----------------------------
  // Open Razorpay checkout
  // -----------------------------
  const openRazorpay = async () => {
    if (!razorpayLoaded) {
      toast.error("Razorpay is not loaded yet. Please wait.");
      return;
    }

    if (!(await checkRegistration())) return;

    const { email, name, phone, class: studentClass } = formData;

    // Check all required fields
    if (!email || !name || !phone || !studentClass) {
      toast.error("All student details are required to proceed.");
      console.error("❌ Missing fields:", formData);
      return;
    }

    setLoading(true);
    try {
      console.log("📝 Creating order for:", formData);

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
      console.log("📦 Create order response:", data);

      if (!res.ok) {
        toast.error(data.message || "Failed to create order.");
        console.error("❌ Order creation failed:", data);
        return;
      }

      // -----------------------------
      // Razorpay checkout options
      // -----------------------------
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "Sanjeevni Pathshala",
        description: "Monthly Fee",
        handler: () => {
          console.log("✅ Payment successful");
          setPaymentSuccess(true);
        },
        prefill: { name, email, contact: phone },
        theme: { color: "#ec4899" },
      };

      console.log("💳 Opening Razorpay with options:", options);
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("❌ Failed to open Razorpay:", err);
      toast.error("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Handle form submission
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📩 Form submitted with:", formData);
    await openRazorpay();
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-50 via-pink-50 to-purple-50 px-6 text-center">
        <h1 className="text-3xl font-bold text-pink-500 mb-4 animate-bounce">
          🎉 Payment Successful!
        </h1>
        <p className="mb-6 text-purple-700 text-lg animate-fade-in">
          Your monthly fee payment is completed successfully.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg"
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
        <h1 className="text-2xl font-bold text-pink-500 text-center mb-4">
          Monthly Fee Payment
        </h1>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-purple-700 placeholder-purple-400"
        />

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-purple-700 placeholder-purple-400"
        />

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-purple-700 placeholder-purple-400"
        />

        <select
          name="class"
          value={formData.class}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-purple-700"
        >
          <option value="">Select Class</option>
          {[...Array(10)].map((_, i) => (
            <option key={i} value={`Class ${i + 1}`}>
              Class {i + 1}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading || !razorpayLoaded}
          className="bg-pink-500 w-full text-white py-3 rounded-lg hover:bg-pink-600"
        >
          {loading ? "Processing..." : "Pay Monthly Fee (₹200)"}
        </button>
      </form>
    </div>
  );
};

export default MonthlyPaymentPage;
