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

const RegistrationPaymentPage: React.FC = () => {
  const router = useRouter();
  const [regForm, setRegForm] = useState<StudentData>({
    name: "",
    email: "",
    phone: "",
    class: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admissionData");
    if (saved) setRegForm(JSON.parse(saved));
  }, []);
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.id = "razorpay-script";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpay = async () => {
    setLoading(true);
    const resScript = await loadRazorpayScript();
    if (!resScript) {
      toast.error("Failed to load payment gateway. Try again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...regForm, type: "registration" }),
      });

      const data = await res.json();

      if (!data.order) {
        console.error("❌ Order creation failed:", data);
        toast.error(data.message || "Failed to create order.");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "Sanjeevni Pathshala",
        description: "Registration Fee",
        handler: async () => {
          setSuccess(true);
          localStorage.removeItem("admissionData");
        },
        prefill: {
          name: regForm.name,
          email: regForm.email,
          contact: regForm.phone,
        },
        theme: { color: "#ec4899" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Payment initiation failed:", err);
      toast.error("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openRazorpay();
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-200 animate-fadeIn">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center animate-pulse">
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            🎉 Registration Completed!
          </h1>
          <p className="text-lg text-gray-700">
            Welcome to the <span className="font-semibold text-green-800">Sanjeevni Pathshala</span> family!
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 mt-6 rounded-lg transition-transform transform hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 via-pink-50 to-purple-50 px-6">
      <Toaster position="top-center" />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 space-y-6 w-full max-w-md animate-fadeIn"
      >
        <h1 className="text-2xl font-bold text-pink-500 text-center mb-4">
          Registration Payment
        </h1>

        <input
          type="text"
          value={regForm.name}
          readOnly
          className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-black"
        />
        <input
          type="email"
          value={regForm.email}
          readOnly
          className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-black"
        />
        <input
          type="tel"
          value={regForm.phone}
          readOnly
          className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-black"
        />
        <input
          type="text"
          value={regForm.class}
          readOnly
          className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-black"
        />
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("editAdmission", "true");
            router.push("/admission");
          }}
          className="text-pink-500 underline"
        >
          Edit Admission Details
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-pink-500 w-full text-white py-3 rounded-lg hover:bg-pink-600 transition-all"
        >
          {loading ? "Processing..." : "Pay Registration Fee (₹200)"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationPaymentPage;
