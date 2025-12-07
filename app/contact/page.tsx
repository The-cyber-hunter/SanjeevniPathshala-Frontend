"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface StatusState {
  message: string;
  type: "success" | "error" | "info";
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<StatusState | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ message: "Sending...", type: "info" });

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact`,
        form
      );
      setStatus({ message: `✅ ${res.data.message}`, type: "success" });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong";
      setStatus({ message: errorMessage, type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 via-pink-50 to-purple-50 px-6">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold text-pink-500 mb-6 text-center">
          Contact Us
        </h1>

        {status && (
          <div
            className={`p-3 mb-4 rounded ${
              status.type === "success"
                ? "bg-green-100 text-green-800"
                : status.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {status.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 space-y-6"
        >
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-purple-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-purple-700 placeholder-purple-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-purple-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-purple-700 placeholder-purple-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-purple-700">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-purple-700 placeholder-purple-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-purple-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message"
              required
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-purple-700 placeholder-purple-400"
            />
          </div>

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg w-full"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
