import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn, GraduationCap } from "lucide-react";

export default function Login({ errors = {} }) {
    const { data, setData, post, processing } = useForm({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login", {
            onSuccess: () => {
                toast.success("Login berhasil!");
            },
            onError: () => {
                toast.error("Login gagal, cek username & password.");
            },
        });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background:
                    "linear-gradient(135deg, #0D7377 0%, #14B8A6 50%, #2DD4BF 100%)",
                fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
        >
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4"
                        style={{
                            background: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.25)",
                        }}
                    >
                        <GraduationCap size={40} color="#fff" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">
                        Presensi Muafa
                    </h1>
                    <p
                        className="text-sm mt-2"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                        Sistem Presensi Guru
                    </p>
                </div>

                {/* Login Card */}
                <div
                    className="bg-white rounded-3xl p-8"
                    style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
                >
                    <h2
                        className="text-xl font-bold text-center mb-6"
                        style={{ color: "#1F2937" }}
                    >
                        Selamat Datang
                    </h2>
                    <p
                        className="text-sm text-center mb-6"
                        style={{ color: "#9CA3AF" }}
                    >
                        Silakan masuk untuk melanjutkan
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label
                                className="block text-xs font-semibold mb-2"
                                style={{ color: "#1F2937" }}
                            >
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                    <svg
                                        className="w-5 h-5"
                                        style={{ color: "#9CA3AF" }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-100 rounded-2xl focus:border-teal-500 focus:outline-none transition-colors text-sm bg-gray-50"
                                    placeholder="Masukkan username"
                                    required
                                    autoFocus
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                className="block text-xs font-semibold mb-2"
                                style={{ color: "#1F2937" }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                    <svg
                                        className="w-5 h-5"
                                        style={{ color: "#9CA3AF" }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-100 rounded-2xl focus:border-teal-500 focus:outline-none transition-colors text-sm bg-gray-50"
                                    placeholder="Masukkan password"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={18}
                                            style={{ color: "#9CA3AF" }}
                                        />
                                    ) : (
                                        <Eye
                                            size={18}
                                            style={{ color: "#9CA3AF" }}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Tombol Login */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 rounded-2xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background:
                                    "linear-gradient(135deg, #2DD4BF 0%, #14B8A6 50%, #0D7377 100%)",
                                boxShadow: "0 10px 25px rgba(13,115,119,0.35)",
                            }}
                        >
                            {processing ? (
                                <>
                                    <svg
                                        className="animate-spin w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                <>Login</>
                            )}
                        </button>
                    </form>

                    {/* Info Akun */}
                    <div
                        className="mt-6 p-4 rounded-2xl"
                        style={{ background: "#F0FDFA" }}
                    >
                        <p
                            className="text-xs font-semibold mb-2"
                            style={{ color: "#0D7377" }}
                        >
                            Akun Demo:
                        </p>
                        <div
                            className="space-y-1 text-xs"
                            style={{ color: "#9CA3AF" }}
                        >
                            <p>
                                Admin:{" "}
                                <span className="font-semibold">admin</span> /{" "}
                                <span className="font-semibold">admin123</span>
                            </p>
                            <p>
                                Guru:{" "}
                                <span className="font-semibold">fauzi</span> /{" "}
                                <span className="font-semibold">guru123</span>
                            </p>
                        </div>
                    </div>
                </div>

                <p
                    className="text-center text-xs mt-6"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                >
                    © 2026 Presensi Muafa - All rights reserved
                </p>
            </div>
        </div>
    );
}
