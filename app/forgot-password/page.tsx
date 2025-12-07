"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const [countdown, setCountdown] = useState(0);
    const [isResending, setIsResending] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // ---------------------------------------
    // Countdown effect
    // ---------------------------------------
    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    // ---------------------------------------
    // Send OTP
    // ---------------------------------------
    const sendOTP = async (isResend = false) => {
        try {
            if (isResend) setIsResending(true);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/forgot-password`,
                { method: "POST" }
            );

            const data = await res.json();

            if (res.ok) {
                toast.success(isResend ? "OTP resent successfully" : "OTP sent to admin email");
                setStep(2);
                setCountdown(30);
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Server error");
        } finally {
            if (isResend) setIsResending(false);
        }
    };

    // ---------------------------------------
    // Verify OTP
    // ---------------------------------------
    const verifyOTP = async () => {
        const otp = otpDigits.join("");

        if (otp.length !== 6) {
            toast.error("Enter full 6-digit OTP");
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/verify-otp`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ otp }),
                }
            );

            const data = await res.json();

            if (res.ok) {
                sessionStorage.setItem("otpVerified", "true");
                sessionStorage.setItem("tempToken", data.tempToken);
                router.push("/reset-password");
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Server error");
        }
    };

    // ---------------------------------------
    // Handle OTP typing, auto-focus, backspace, paste
    // ---------------------------------------
    const handleOtpChange = (value: string, index: number) => {
        if (/[^0-9]/.test(value)) return; // Only digits allowed

        const newOtp = [...otpDigits];
        newOtp[index] = value.slice(-1); // only keep last typed

        setOtpDigits(newOtp);

        // Auto move to next
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: any, index: number) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: any) => {
        const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");

        if (pasteData.length === 6) {
            const digits = pasteData.split("").slice(0, 6);
            setOtpDigits(digits);

            // Focus last box
            inputRefs.current[5]?.focus();
        }
    };

    // ---------------------------------------

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100">
            <Toaster />

            <div className="bg-white p-8 rounded-lg shadow-md w-96 space-y-6">
                <h1 className="text-2xl font-bold text-purple-700 text-center">
                    Forgot Password
                </h1>

                {/* STEP 1: Send OTP */}
                {step === 1 && (
                    <button
                        onClick={() => sendOTP(false)}
                        className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800"
                    >
                        Send OTP to Email
                    </button>
                )}

                {/* STEP 2: Verify OTP */}
                {step === 2 && (
                    <>
                        <div className="flex justify-between gap-2" onPaste={handlePaste}>
                            {otpDigits.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}

                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-12 border border-purple-400 text-center text-xl text-purple-800 rounded-lg focus:border-purple-600 focus:ring-purple-600"
                                />
                            ))}
                        </div>

                        <button
                            onClick={verifyOTP}
                            className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800"
                        >
                            Verify OTP
                        </button>

                        {/* RESEND OTP + COUNTDOWN */}
                        <div className="text-center mt-3">
                            {countdown > 0 ? (
                                <p className="text-purple-600">
                                    Resend OTP in <b>{countdown}</b>s
                                </p>
                            ) : (
                                <button
                                    disabled={isResending}
                                    onClick={() => sendOTP(true)}
                                    className={`text-purple-700 underline font-medium ${isResending
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:text-purple-900"
                                        }`}
                                >
                                    {isResending ? "Resending..." : "Resend OTP"}
                                </button>
                            )}
                        </div>
                    </>
                )}

                <p
                    onClick={() => router.push("/login-admin")}
                    className="block w-full text-center text-purple-700 font-medium text-lg cursor-pointer transition-colors duration-300 hover:text-red-600 hover:underline"
                >
                    Back to login?
                </p>
            </div>
        </div>
    );
}
