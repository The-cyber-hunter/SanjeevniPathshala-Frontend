"use client";

import React, { useState, useEffect } from "react";
import { Phone, MessageCircle, ChevronUp } from "lucide-react";

const HomePage: React.FC = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-linear-to-b from-yellow-50 via-pink-50 to-purple-50 text-purple-800">
      <section className="text-center py-24 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-500 mb-4">
          Welcome to Sanjeevni Coaching
        </h1>
        <p className="text-lg md:text-xl text-purple-700 max-w-2xl mx-auto">
          We guide students with love, fun, and dedication! Learn smarter, grow faster.
        </p>
      </section>
      <section className="py-16 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-pink-500 mb-2">Experienced Teachers</h2>
          <p>Our mentors are skilled and friendly, helping students understand concepts easily.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-purple-500 mb-2">Interactive Classes</h2>
          <p>We use modern tools and activities to make learning fun and engaging.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-yellow-500 mb-2">Flexible Schedule</h2>
          <p>Choose a timing that fits your routine. We ensure personalized attention.</p>
        </div>
      </section>
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-pink-500 mb-6 text-center">Classes We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="text-purple-700 font-semibold text-lg">Class {i + 1}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-16 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-pink-100 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold text-pink-500 mb-2">Personalized Attention</h3>
          <p>We focus on individual student growth, making sure every child excels.</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold text-purple-500 mb-2">Fun & Interactive Learning</h3>
          <p>Classes are engaging with activities, quizzes, and interactive discussions.</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold text-yellow-500 mb-2">Flexible Schedule</h3>
          <p>Students can pick timings that fit their routine without stress.</p>
        </div>
      </section>
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-pink-500 mb-4">Join Us Today!</h2>
        <p className="text-purple-700 mb-6">Admissions open for classes 1 to 10. Secure your seat now.</p>
        <a
          href="/admission"
          className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-semibold transition"
        >
          Apply Now
        </a>
      </section>
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <a
          href="tel:+911234567890"
          className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition"
        >
          <Phone size={24} />
        </a>

        <a
          href="sms:+911234567890"
          className="bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition"
        >
          <MessageCircle size={24} />
        </a>

        {showScroll && (
          <button
            onClick={scrollToTop}
            className="bg-purple-500 hover:bg-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition"
          >
            <ChevronUp size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
