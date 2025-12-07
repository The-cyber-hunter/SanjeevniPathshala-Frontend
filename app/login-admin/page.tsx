"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

const AdminLoginPage: React.FC = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const MAX_ATTEMPTS = 3;
  const LOCK_TIME = 5 * 60 * 1000; 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminLoginTime", Date.now().toString());

        toast.success("Login successful");
        router.push("/Bosspannel"); 
      } else {
        toast.error(data.message);
        setPassword("");
        setAttempts((prev) => {
          const next = prev + 1;
          if (next >= MAX_ATTEMPTS) {
            setIsLocked(true);
            toast.error(
              `Too many attempts! Try again in ${LOCK_TIME / 60000} minutes`
            );
            setTimeout(() => {
              setAttempts(0);
              setIsLocked(false);
            }, LOCK_TIME);
          }
          return next;
        });
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <Toaster />
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-96 space-y-6"
      >
        <h1 className="text-2xl font-bold text-purple-700 text-center">
          Admin Login
        </h1>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          disabled={isLocked}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-purple-700 placeholder-purple-400"
        />

        <button
          type="submit"
          disabled={isSubmitting || isLocked}
          className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {isLocked && (
          <p className="text-red-600 text-center">
            Too many attempts! Try again later.
          </p>
        )}

        <p
          onClick={() => router.push("/forgot-password")}
          className="block w-full text-center text-purple-700 font-medium text-lg cursor-pointer transition-colors duration-300 hover:text-red-600 hover:underline"
        >
          Forgot Password?
        </p>
      </form>
    </div>
  );
};

export default AdminLoginPage;
