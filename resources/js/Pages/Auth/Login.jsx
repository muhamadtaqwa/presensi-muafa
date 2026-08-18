import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Eye, EyeOff, GraduationCap } from "lucide-react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showLupa, setShowLupa] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login", {
            onSuccess: (page) => {
                if (
                    page.props.errors &&
                    Object.keys(page.props.errors).length > 0
                ) {
                    toast.error(
                        page.props.errors.username ||
                            "Login gagal, cek username & password.",
                    );
                } else {
                    toast.success("Login berhasil!");
                }
            },
            onError: (errors) => {
                toast.error(
                    errors.username || "Login gagal, cek username & password.",
                );
            },
        });
    };

    return (
        <div
            className="relative min-h-screen overflow-hidden flex items-center justify-center p-6"
            style={{
                background:
                    "linear-gradient(135deg, #0D7377 0%, #14B8A6 50%, #2DD4BF 100%)",
                fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
        >
            {/* Dekorasi blur */}
            <div
                className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
                aria-hidden="true"
            />
            <div
                className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative w-full max-w-sm">
                {/* Logo & Title */}
                <div className="text-center mb-6">
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
                    <h1 className="text-2xl font-bold text-white">
                        Presensi Muafa
                    </h1>
                    <p
                        className="text-sm mt-1"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                        Sistem Presensi Digital
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[28px] p-7 shadow-2xl">
                    <h2
                        className="text-xl font-bold text-center mb-5"
                        style={{ color: "#1F2937" }}
                    >
                        Selamat Datang
                    </h2>

                    {errors.auth && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {errors.auth}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label
                                className="block text-sm font-semibold mb-2"
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
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-2xl focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-colors text-sm bg-gray-50"
                                    placeholder="Masukkan username"
                                    required
                                    autoFocus
                                    autoComplete="username"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                className="block text-sm font-semibold mb-2"
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
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-100 rounded-2xl focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-colors text-sm bg-gray-50"
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
                                            size={20}
                                            style={{ color: "#9CA3AF" }}
                                        />
                                    ) : (
                                        <Eye
                                            size={20}
                                            style={{ color: "#9CA3AF" }}
                                        />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Lupa Password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowLupa(true)}
                                className="text-sm text-teal-600 hover:underline"
                            >
                                Lupa Password?
                            </button>
                        </div>

                        {/* Tombol Login */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background:
                                    "linear-gradient(135deg, #2DD4BF 0%, #14B8A6 50%, #0D7377 100%)",
                                boxShadow: "0 10px 25px rgba(13,115,119,0.35)",
                            }}
                        >
                            {processing ? "Sedang Login..." : "Login"}
                        </button>
                    </form>
                </div>

                <p
                    className="text-center text-xs mt-5"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                >
                    © 2026 Presensi Muafa - All rights reserved
                </p>
            </div>

            {/* Lupa Password Modal */}
            {showLupa && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowLupa(false)}
                        aria-hidden="true"
                    />
                    <div className="relative bg-white rounded-[28px] shadow-2xl w-full max-w-sm p-7 text-center">
                        <h3 className="font-semibold text-lg">
                            Lupa Password?
                        </h3>
                        <p className="text-sm text-slate-500 mt-2">
                            Hubungi Admin
                        </p>
                        <p className="text-xl font-bold text-teal-700 mt-2">
                            08985949733
                        </p>
                        <button
                            onClick={() => setShowLupa(false)}
                            className="mt-5 w-full border border-slate-200 py-2.5 rounded-2xl text-sm hover:bg-slate-50"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
