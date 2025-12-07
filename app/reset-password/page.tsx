"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

export default function ResetPasswordPage() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // -------------------------------
    // BLOCK ENTRY WITHOUT OTP VERIFY
    // -------------------------------
    useEffect(() => {
        const allowed = sessionStorage.getItem("otpVerified");
        if (!allowed) {
            router.push("/forgot-password");
        }
    }, []);

    const resetPassword = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Password reset successfully!");
                sessionStorage.removeItem("otpVerified");
                setTimeout(() => router.push("/login-admin"), 1200);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Server error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100">
            <Toaster />

            <div className="bg-white p-8 rounded-lg shadow-md w-96 space-y-6">
                <h1 className="text-2xl font-bold text-black text-center">
                    Reset Password
                </h1>

                {/* PASSWORD */}
                <div>
                    <label className="block text-black mb-1">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-purple-300 rounded-lg px-4 py-2 text-black placeholder-purple-400"
                            placeholder="Enter new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2 text-xl"
                        >
                            {showPassword ? "🐵" : "🙈"}
                        </button>
                    </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                    <label className="block text-black mb-1">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-purple-300 rounded-lg px-4 py-2 text-black placeholder-purple-400"
                            placeholder="Confirm password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2 text-xl"
                        >
                            {showConfirmPassword ? "🐵" : "🙈"}
                        </button>
                    </div>
                </div>

                <button
                    onClick={resetPassword}
                    className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800"
                >
                    Reset Password
                </button>

                <p
                    onClick={() => router.push("/login-admin")}
                    className="block w-full text-center text-purple-700 font-medium text-lg cursor-pointer hover:text-red-600 hover:underline"
                >
                    Back to Login
                </p>
            </div>
        </div>
    );
}
