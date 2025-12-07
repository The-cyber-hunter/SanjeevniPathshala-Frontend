"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

const AdmissionPage: React.FC = () => {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    class: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user clicked "Edit Admission Details"
    const editMode = localStorage.getItem("editAdmission");
    if (editMode === "true") {
      const savedData = localStorage.getItem("admissionData");
      if (savedData) {
        setFormData(JSON.parse(savedData));
        console.log("📝 Loaded saved admission data:", JSON.parse(savedData));
      }
      localStorage.removeItem("editAdmission"); // remove flag after loading
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("📤 Form submitted with:", formData);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/status/${formData.email}`
      );
      const data = await res.json();

      console.log("🔍 Registration status response:", data);

      if (data.registered) {
        toast.error("This email is already registered!");
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("admissionData", JSON.stringify(formData));
      router.push("/registration-payment");
    } catch (err) {
      console.error("❌ Error checking registration:", err);
      toast.error("Failed to check registration status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 via-pink-50 to-purple-50 px-6">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold text-pink-500 mb-6 text-center">
          Admission Form
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-8 space-y-6 animate-fadeIn"
        >
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-purple-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-purple-700 placeholder-purple-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-purple-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-purple-700 placeholder-purple-400"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col flex-1">
              <label className="mb-1 font-medium text-purple-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-purple-700 placeholder-purple-400"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label className="mb-1 font-medium text-purple-700">Class</label>
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
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg w-full transition-all"
          >
            {isSubmitting ? "Checking..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdmissionPage;
