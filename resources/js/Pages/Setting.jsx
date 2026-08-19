import React, { useState } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import toast from "react-hot-toast";
import AppLayout from "./Layouts/AppLayout";
import { Eye, EyeOff } from "lucide-react";

function Setting() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role === "admin";

    // Form ganti password (admin only)
    const {
        data: passwordData,
        setData: setPasswordData,
        post,
        processing: passwordProcessing,
        reset: resetPassword,
    } = useForm({
        password_lama: "",
        password_baru: "",
        password_baru_confirmation: "",
    });

    // Form edit data (guru only)
    const {
        data: profileData,
        setData: setProfileData,
        put,
        processing: profileProcessing,
    } = useForm({
        name: user?.name || "",
        username: user?.username || "",
        nip: user?.nip || "",
        jabatan: user?.jabatan || "",
    });

    const [showLama, setShowLama] = useState(false);
    const [showBaru, setShowBaru] = useState(false);

    const handleGantiPassword = (e) => {
        e.preventDefault();
        post("/setting/password", {
            onSuccess: () => {
                toast.success("Password berhasil diganti");
                resetPassword();
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

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        put(`/setting/profile`, {
            onSuccess: () => {
                toast.success("Data berhasil diupdate");
            },
            onError: () => {
                toast.error("Gagal update data");
            },
        });
    };

    return (
        <>
            <div className="max-w-md mx-auto space-y-4">
                {/* Info User - Gradient Hijau, kanan kiri */}
                <div
                    className="rounded-2xl px-5 py-4 text-white"
                    style={{
                        background:
                            "linear-gradient(135deg, #2DD4BF 0%, #14B8A6 50%, #0D7377 100%)",
                        boxShadow: "0 8px 25px rgba(13,115,119,0.3)",
                    }}
                >
                    <h3
                        className="font-bold text-sm mb-3"
                        style={{ color: "#FFFFFF" }}
                    >
                        Info User
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span style={{ color: "rgba(255,255,255,0.7)" }}>
                                Nama
                            </span>
                            <span
                                className="font-semibold"
                                style={{ color: "#FFFFFF" }}
                            >
                                {user?.name || "-"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span style={{ color: "rgba(255,255,255,0.7)" }}>
                                Username
                            </span>
                            <span
                                className="font-semibold"
                                style={{ color: "#FFFFFF" }}
                            >
                                {user?.username || "-"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span style={{ color: "rgba(255,255,255,0.7)" }}>
                                Role
                            </span>
                            <span
                                className="font-semibold capitalize"
                                style={{ color: "#FFFFFF" }}
                            >
                                {user?.role || "-"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Admin: Ganti Password */}
                {isAdmin ? (
                    <div
                        className="bg-white rounded-2xl p-5"
                        style={{
                            boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                        }}
                    >
                        <h3
                            className="font-bold text-sm mb-3"
                            style={{ color: "#1F2937" }}
                        >
                            Ganti Password
                        </h3>

                        <form
                            onSubmit={handleGantiPassword}
                            className="space-y-3"
                        >
                            <div>
                                <label
                                    className="text-xs block mb-1"
                                    style={{ color: "#9CA3AF" }}
                                >
                                    Password Lama
                                </label>
                                <div className="relative">
                                    <input
                                        type={showLama ? "text" : "password"}
                                        value={passwordData.password_lama}
                                        onChange={(e) =>
                                            setPasswordData(
                                                "password_lama",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30 pr-9"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowLama(!showLama)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-2.5"
                                    >
                                        {showLama ? (
                                            <EyeOff
                                                size={15}
                                                style={{ color: "#9CA3AF" }}
                                            />
                                        ) : (
                                            <Eye
                                                size={15}
                                                style={{ color: "#9CA3AF" }}
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label
                                    className="text-xs block mb-1"
                                    style={{ color: "#9CA3AF" }}
                                >
                                    Password Baru
                                </label>
                                <div className="relative">
                                    <input
                                        type={showBaru ? "text" : "password"}
                                        value={passwordData.password_baru}
                                        onChange={(e) =>
                                            setPasswordData(
                                                "password_baru",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30 pr-9"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowBaru(!showBaru)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-2.5"
                                    >
                                        {showBaru ? (
                                            <EyeOff
                                                size={15}
                                                style={{ color: "#9CA3AF" }}
                                            />
                                        ) : (
                                            <Eye
                                                size={15}
                                                style={{ color: "#9CA3AF" }}
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label
                                    className="text-xs block mb-1"
                                    style={{ color: "#9CA3AF" }}
                                >
                                    Konfirmasi
                                </label>
                                <input
                                    type="password"
                                    value={
                                        passwordData.password_baru_confirmation
                                    }
                                    onChange={(e) =>
                                        setPasswordData(
                                            "password_baru_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={passwordProcessing}
                                className="w-full py-2.5 rounded-full text-white font-semibold text-sm disabled:opacity-50"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                    boxShadow:
                                        "0 4px 12px rgba(13,115,119,0.3)",
                                }}
                            >
                                {passwordProcessing
                                    ? "Menyimpan..."
                                    : "Ganti Password"}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Guru: Edit Data Diri */
                    <div
                        className="bg-white rounded-2xl p-5"
                        style={{
                            boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                        }}
                    >
                        <h3
                            className="font-bold text-sm mb-3"
                            style={{ color: "#1F2937" }}
                        >
                            Edit Data
                        </h3>

                        <form
                            onSubmit={handleUpdateProfile}
                            className="space-y-3"
                        >
                            <div>
                                <label
                                    className="text-xs block mb-1"
                                    style={{ color: "#9CA3AF" }}
                                >
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) =>
                                        setProfileData("name", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    className="text-xs block mb-1"
                                    style={{ color: "#9CA3AF" }}
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={profileData.username}
                                    onChange={(e) =>
                                        setProfileData(
                                            "username",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    className="text-xs block mb-1"
                                    style={{ color: "#9CA3AF" }}
                                >
                                    NIP
                                </label>
                                <input
                                    type="text"
                                    value={profileData.nip}
                                    onChange={(e) =>
                                        setProfileData("nip", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                />
                            </div>

                            <div>
                                <label
                                    className="text-xs block mb-1"
                                    style={{ color: "#9CA3AF" }}
                                >
                                    Jabatan
                                </label>
                                <input
                                    type="text"
                                    value={profileData.jabatan}
                                    onChange={(e) =>
                                        setProfileData(
                                            "jabatan",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={profileProcessing}
                                className="w-full py-2.5 rounded-full text-white font-semibold text-sm disabled:opacity-50"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                    boxShadow:
                                        "0 4px 12px rgba(13,115,119,0.3)",
                                }}
                            >
                                {profileProcessing
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Logout */}
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="w-full py-3 rounded-2xl text-sm font-semibold transition-all"
                    style={{
                        background: "#FFFFFF",
                        color: "#DC2626",
                        boxShadow: "0 4px 12px rgba(220,38,38,0.08)",
                    }}
                >
                    Logout
                </Link>
            </div>
        </>
    );
}

Setting.layout = (page) => <AppLayout header="Pengaturan">{page}</AppLayout>;

export default Setting;
