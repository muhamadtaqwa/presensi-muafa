import React from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import AppLayout from "./Layouts/AppLayout";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function Setting({ errors = {} }) {
    const { data, setData, post, processing, reset } = useForm({
        password_lama: "",
        password_baru: "",
        password_baru_confirmation: "",
    });

    const [showLama, setShowLama] = useState(false);
    const [showBaru, setShowBaru] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/setting/password", {
            onSuccess: () => {
                toast.success("Password berhasil diganti");
                reset();
            },
            onError: (err) => {
                if (err.password_lama) {
                    toast.error(err.password_lama);
                } else {
                    toast.error("Gagal mengganti password");
                }
            },
        });
    };

    return (
        <>
            <div className="max-w-md mx-auto space-y-6">
                {/* Header */}
                <div
                    className="rounded-3xl px-6 py-8 text-white"
                    style={{
                        background:
                            "linear-gradient(150deg, #2DD4BF 0%, #14B8A6 55%, #0D7377 100%)",
                        boxShadow: "0 10px 25px rgba(13,115,119,0.25)",
                    }}
                >
                    <h2 className="text-2xl font-bold">Pengaturan</h2>
                    <p
                        className="text-sm mt-2"
                        style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                        Ganti password akun Anda
                    </p>
                </div>

                {/* Form Ganti Password */}
                <div
                    className="bg-white rounded-2xl p-6"
                    style={{ boxShadow: "0 8px 20px rgba(13,115,119,0.08)" }}
                >
                    <h3
                        className="font-bold text-lg mb-4"
                        style={{ color: "#1F2937" }}
                    >
                        Ganti Password
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Password Lama */}
                        <div>
                            <label
                                className="block text-xs font-semibold mb-1.5"
                                style={{ color: "#1F2937" }}
                            >
                                Password Lama
                            </label>
                            <div className="relative">
                                <input
                                    type={showLama ? "text" : "password"}
                                    value={data.password_lama}
                                    onChange={(e) =>
                                        setData("password_lama", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30 pr-12"
                                    placeholder="Masukkan password lama"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLama(!showLama)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                                >
                                    {showLama ? (
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

                        {/* Password Baru */}
                        <div>
                            <label
                                className="block text-xs font-semibold mb-1.5"
                                style={{ color: "#1F2937" }}
                            >
                                Password Baru
                            </label>
                            <div className="relative">
                                <input
                                    type={showBaru ? "text" : "password"}
                                    value={data.password_baru}
                                    onChange={(e) =>
                                        setData("password_baru", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30 pr-12"
                                    placeholder="Masukkan password baru"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowBaru(!showBaru)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                                >
                                    {showBaru ? (
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

                        {/* Konfirmasi Password Baru */}
                        <div>
                            <label
                                className="block text-xs font-semibold mb-1.5"
                                style={{ color: "#1F2937" }}
                            >
                                Konfirmasi Password Baru
                            </label>
                            <input
                                type="password"
                                value={data.password_baru_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_baru_confirmation",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-4 py-3 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                placeholder="Ulangi password baru"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 rounded-full text-white font-semibold text-sm transition-all disabled:opacity-50"
                            style={{
                                background:
                                    "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                boxShadow: "0 4px 12px rgba(13,115,119,0.3)",
                            }}
                        >
                            {processing ? "Menyimpan..." : "Ganti Password"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

Setting.layout = (page) => <AppLayout header="Pengaturan">{page}</AppLayout>;

export default Setting;
