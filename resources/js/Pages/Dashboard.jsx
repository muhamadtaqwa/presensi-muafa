import React from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "./Layouts/AppLayout";

function Dashboard({ stats, listGuru }) {
    const today = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div
                    className="rounded-3xl px-6 py-8 text-white"
                    style={{
                        background:
                            "linear-gradient(150deg, #2DD4BF 0%, #14B8A6 55%, #0D7377 100%)",
                        boxShadow: "0 10px 25px rgba(13,115,119,0.25)",
                    }}
                >
                    <p
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                        {today}
                    </p>
                    <h2 className="text-2xl font-bold mt-1">Dashboard Admin</h2>
                    <p
                        className="text-sm mt-2"
                        style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                        Ringkasan presensi guru hari ini
                    </p>
                </div>

                {/* Statistik */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div
                        className="bg-white rounded-2xl p-5"
                        style={{
                            boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                        }}
                    >
                        <p
                            className="text-xs font-semibold"
                            style={{ color: "#9CA3AF" }}
                        >
                            Total Guru
                        </p>
                        <p
                            className="text-3xl font-bold mt-2"
                            style={{ color: "#0D7377" }}
                        >
                            {stats.totalGuru}
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-5"
                        style={{
                            boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                        }}
                    >
                        <p
                            className="text-xs font-semibold"
                            style={{ color: "#9CA3AF" }}
                        >
                            Sudah Presensi
                        </p>
                        <p
                            className="text-3xl font-bold mt-2"
                            style={{ color: "#22C55E" }}
                        >
                            {stats.sudahPresensi}
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-5"
                        style={{
                            boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                        }}
                    >
                        <p
                            className="text-xs font-semibold"
                            style={{ color: "#9CA3AF" }}
                        >
                            Belum Presensi
                        </p>
                        <p
                            className="text-3xl font-bold mt-2"
                            style={{ color: "#EF4444" }}
                        >
                            {stats.belumPresensi}
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-5"
                        style={{
                            boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                        }}
                    >
                        <p
                            className="text-xs font-semibold"
                            style={{ color: "#9CA3AF" }}
                        >
                            Izin / Sakit
                        </p>
                        <p
                            className="text-3xl font-bold mt-2"
                            style={{ color: "#F59E0B" }}
                        >
                            {stats.izinSakit}
                        </p>
                    </div>
                </div>

                {/* Daftar Guru Hari Ini */}
                <div
                    className="bg-white rounded-2xl p-6"
                    style={{ boxShadow: "0 8px 20px rgba(13,115,119,0.08)" }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3
                            className="font-bold text-lg"
                            style={{ color: "#1F2937" }}
                        >
                            Daftar Guru Hari Ini
                        </h3>
                        <Link
                            href="/rekap"
                            className="text-sm font-semibold"
                            style={{ color: "#0D7377" }}
                        >
                            Lihat Rekap →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr
                                    className="border-b"
                                    style={{ borderColor: "#CCFBF1" }}
                                >
                                    <th
                                        className="text-left py-3 px-2 text-xs font-semibold"
                                        style={{ color: "#9CA3AF" }}
                                    >
                                        Nama
                                    </th>
                                    <th
                                        className="text-left py-3 px-2 text-xs font-semibold"
                                        style={{ color: "#9CA3AF" }}
                                    >
                                        Jabatan
                                    </th>
                                    <th
                                        className="text-left py-3 px-2 text-xs font-semibold"
                                        style={{ color: "#9CA3AF" }}
                                    >
                                        Status
                                    </th>
                                    <th
                                        className="text-left py-3 px-2 text-xs font-semibold"
                                        style={{ color: "#9CA3AF" }}
                                    >
                                        Jam Datang
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listGuru.map((guru) => (
                                    <tr
                                        key={guru.id}
                                        className="border-b hover:bg-teal-50/30 transition-colors"
                                        style={{ borderColor: "#CCFBF1" }}
                                    >
                                        <td
                                            className="py-3 px-2 text-sm font-medium"
                                            style={{ color: "#1F2937" }}
                                        >
                                            {guru.name}
                                        </td>
                                        <td
                                            className="py-3 px-2 text-sm"
                                            style={{ color: "#9CA3AF" }}
                                        >
                                            {guru.jabatan || "-"}
                                        </td>
                                        <td className="py-3 px-2">
                                            {guru.status === "hadir" ? (
                                                <span
                                                    className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                                                    style={{
                                                        background: "#DCFCE7",
                                                        color: "#16A34A",
                                                    }}
                                                >
                                                    Hadir
                                                </span>
                                            ) : guru.keterangan ? (
                                                <span
                                                    className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                                                    style={{
                                                        background: "#FEF3C7",
                                                        color: "#D97706",
                                                    }}
                                                >
                                                    {guru.keterangan}
                                                </span>
                                            ) : (
                                                <span
                                                    className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                                                    style={{
                                                        background: "#FEE2E2",
                                                        color: "#DC2626",
                                                    }}
                                                >
                                                    Belum
                                                </span>
                                            )}
                                        </td>
                                        <td
                                            className="py-3 px-2 text-sm"
                                            style={{ color: "#9CA3AF" }}
                                        >
                                            {guru.jam_datang || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page) => <AppLayout header="Dashboard">{page}</AppLayout>;

export default Dashboard;
