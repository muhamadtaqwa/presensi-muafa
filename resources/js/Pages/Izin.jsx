import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "./Layouts/AppLayout";
import toast from "react-hot-toast";

function Izin({ riwayatIzin }) {
    const today = new Date().toLocaleDateString("en-CA");
    const [tanggal, setTanggal] = useState(today);
    const [jenis, setJenis] = useState("izin");
    const [keterangan, setKeterangan] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!tanggal) {
            toast.error("Tanggal wajib diisi");
            return;
        }

        if (!keterangan || keterangan.length < 5) {
            toast.error("Keterangan minimal 5 karakter");
            return;
        }

        setProcessing(true);

        router.post(
            "/izin",
            {
                tanggal,
                jenis_izin: jenis,
                keterangan,
            },
            {
                onSuccess: () => {
                    toast.success("Izin berhasil diajukan");
                    setKeterangan("");
                    setTanggal(today);
                    setJenis("izin");
                    setProcessing(false);
                },
                onError: (errors) => {
                    toast.error(errors.keterangan || "Gagal mengajukan izin");
                    setProcessing(false);
                },
            },
        );
    };

    const batalkanIzin = (id) => {
        if (!confirm("Yakin ingin batalkan izin ini?")) return;

        router.delete(`/izin/${id}`, {
            onSuccess: () => {
                toast.success("Izin berhasil dibatalkan");
            },
            onError: () => {
                toast.error("Gagal membatalkan izin");
            },
        });
    };

    return (
        <>
            <div className="max-w-4xl mx-auto lg:max-w-full space-y-4">
                {/* Header */}
                <div
                    className="rounded-2xl px-5 py-4 text-white"
                    style={{
                        background:
                            "linear-gradient(135deg, #2DD4BF 0%, #14B8A6 50%, #0D7377 100%)",
                        boxShadow: "0 4px 15px rgba(13,115,119,0.2)",
                    }}
                >
                    <h2 className="text-lg font-bold">Ajukan Izin</h2>
                    <p
                        className="text-xs mt-1"
                        style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                        Isi form untuk izin, sakit, atau dinas
                    </p>
                </div>

                {/* Form & Riwayat - 2 Grid Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                    {/* Form Izin */}
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
                            Form Izin
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label
                                    className="block text-xs font-semibold mb-1.5"
                                    style={{ color: "#1F2937" }}
                                >
                                    Jenis
                                </label>
                                <select
                                    value={jenis}
                                    onChange={(e) => setJenis(e.target.value)}
                                    className="w-full px-4 py-2.5 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                    style={{ color: "#1F2937" }}
                                >
                                    <option value="izin">Izin</option>
                                    <option value="sakit">Sakit</option>
                                    <option value="dinas">Dinas</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    className="block text-xs font-semibold mb-1.5"
                                    style={{ color: "#1F2937" }}
                                >
                                    Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={tanggal}
                                    onChange={(e) => setTanggal(e.target.value)}
                                    className="w-full px-4 py-2.5 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                    style={{ color: "#1F2937" }}
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-xs font-semibold mb-1.5"
                                    style={{ color: "#1F2937" }}
                                >
                                    Keterangan
                                </label>
                                <textarea
                                    value={keterangan}
                                    onChange={(e) =>
                                        setKeterangan(e.target.value)
                                    }
                                    rows="4"
                                    className="w-full px-4 py-2.5 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                    style={{ color: "#1F2937" }}
                                    placeholder="Contoh: Izin karena ada keperluan keluarga"
                                    required
                                    minLength={5}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 rounded-full text-white font-semibold text-sm disabled:opacity-50"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                    boxShadow:
                                        "0 4px 12px rgba(13,115,119,0.3)",
                                }}
                            >
                                {processing ? "Mengajukan..." : "Ajukan Izin"}
                            </button>
                        </form>
                    </div>

                    {/* Riwayat Izin */}
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
                            Riwayat Izin
                        </h3>
                        {riwayatIzin?.length === 0 || !riwayatIzin ? (
                            <p
                                className="text-xs text-center py-4"
                                style={{ color: "#9CA3AF" }}
                            >
                                Belum ada riwayat izin
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {riwayatIzin.map((item, index) => (
                                    <div
                                        key={index}
                                        className="py-3 border-b last:border-0"
                                        style={{ borderColor: "#F0FDFA" }}
                                    >
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span style={{ color: "#9CA3AF" }}>
                                                Tanggal
                                            </span>
                                            <span
                                                className="font-semibold"
                                                style={{ color: "#1F2937" }}
                                            >
                                                {item.hari
                                                    ? `${item.hari}, ${item.tanggal}`
                                                    : item.tanggal}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span style={{ color: "#9CA3AF" }}>
                                                Jenis
                                            </span>
                                            <span
                                                className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold"
                                                style={{
                                                    background:
                                                        item.jenis === "Sakit"
                                                            ? "#FEE2E2"
                                                            : "#FEF3C7",
                                                    color:
                                                        item.jenis === "Sakit"
                                                            ? "#DC2626"
                                                            : "#D97706",
                                                }}
                                            >
                                                {item.jenis}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-start text-xs mb-2">
                                            <span style={{ color: "#9CA3AF" }}>
                                                Keterangan
                                            </span>
                                            <span
                                                className="font-medium text-right"
                                                style={{
                                                    color: "#1F2937",
                                                    maxWidth: "70%",
                                                }}
                                            >
                                                {item.keterangan}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                batalkanIzin(item.id)
                                            }
                                            className="w-full py-2 rounded-full text-xs font-semibold"
                                            style={{
                                                background: "#FEE2E2",
                                                color: "#DC2626",
                                            }}
                                        >
                                            Batalkan Izin
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Izin.layout = (page) => <AppLayout header="Izin">{page}</AppLayout>;

export default Izin;
