import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import AppLayout from "./Layouts/AppLayout";
import { LayoutDashboard, CheckCircle2, Clock } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function Dashboard({
    isAdmin,
    stats,
    belumAbsenList,
    kehadiranMingguan,
    aktivitasTerbaru,
    presensiBulan,
    statistikBulan,
    presensiToday,
    izinHariIni,
    bulan,
    tahun,
    riwayatPresensi,
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [jam, setJam] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setJam(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const today = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const namaBulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    // ============ ADMIN VIEW ============
    if (isAdmin) {
        return (
            <>
                <div className="space-y-4">
                    {/* Header Card */}
                    <div
                        className="rounded-2xl px-5 py-5 text-white relative overflow-hidden"
                        style={{
                            background:
                                "linear-gradient(135deg, #2DD4BF 0%, #14B8A6 50%, #0D7377 100%)",
                            boxShadow: "0 8px 25px rgba(13,115,119,0.3)",
                        }}
                    >
                        <div
                            className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
                            style={{ background: "rgba(255,255,255,0.1)" }}
                        />
                        <div
                            className="absolute -bottom-10 -left-4 w-24 h-24 rounded-full"
                            style={{ background: "rgba(255,255,255,0.05)" }}
                        />
                        <div className="relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p
                                        className="text-xs font-medium"
                                        style={{
                                            color: "rgba(255,255,255,0.8)",
                                        }}
                                    >
                                        Selamat Datang, {user?.name}
                                    </p>
                                    <h2 className="text-xl font-bold mt-1">
                                        Dashboard Admin
                                    </h2>
                                    <p className="text-sm font-bold mt-1">
                                        {jam.toLocaleTimeString("id-ID", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <LayoutDashboard size={24} color="#fff" />
                                </div>
                            </div>
                            <p
                                className="text-xs mt-2"
                                style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                                {today}
                            </p>
                        </div>
                    </div>

                    {/* Statistik Presensi - 4 Kolom Desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div
                            className="bg-white rounded-xl p-4"
                            style={{
                                boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                            }}
                        >
                            <p
                                className="text-xs font-medium"
                                style={{ color: "#9CA3AF" }}
                            >
                                Total Guru
                            </p>
                            <p
                                className="text-lg font-bold mt-1"
                                style={{ color: "#0D7377" }}
                            >
                                {stats.totalGuru}
                            </p>
                        </div>
                        <div
                            className="bg-white rounded-xl p-4"
                            style={{
                                boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                            }}
                        >
                            <p
                                className="text-xs font-medium"
                                style={{ color: "#9CA3AF" }}
                            >
                                Sudah Presensi
                            </p>
                            <p
                                className="text-lg font-bold mt-1"
                                style={{ color: "#22C55E" }}
                            >
                                {stats.sudahPresensi}
                            </p>
                        </div>
                        <div
                            className="bg-white rounded-xl p-4"
                            style={{
                                boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                            }}
                        >
                            <p
                                className="text-xs font-medium"
                                style={{ color: "#9CA3AF" }}
                            >
                                Belum Presensi
                            </p>
                            <p
                                className="text-lg font-bold mt-1"
                                style={{ color: "#EF4444" }}
                            >
                                {stats.belumPresensi}
                            </p>
                        </div>
                        <div
                            className="bg-white rounded-xl p-4"
                            style={{
                                boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                            }}
                        >
                            <p
                                className="text-xs font-medium"
                                style={{ color: "#9CA3AF" }}
                            >
                                Izin / Sakit
                            </p>
                            <p
                                className="text-lg font-bold mt-1"
                                style={{ color: "#F59E0B" }}
                            >
                                {stats.izinSakit}
                            </p>
                        </div>
                    </div>

                    {/* Statistik Baru - 4 Kolom Desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div
                            className="bg-white rounded-xl p-4"
                            style={{
                                boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                            }}
                        >
                            <p
                                className="text-xs font-medium"
                                style={{ color: "#9CA3AF" }}
                            >
                                User Aktif
                            </p>
                            <p
                                className="text-lg font-bold mt-1"
                                style={{ color: "#0D7377" }}
                            >
                                {stats.userAktif}
                            </p>
                        </div>
                        <div
                            className="bg-white rounded-xl p-4"
                            style={{
                                boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                            }}
                        >
                            <p
                                className="text-xs font-medium"
                                style={{ color: "#9CA3AF" }}
                            >
                                Total User
                            </p>
                            <p
                                className="text-lg font-bold mt-1"
                                style={{ color: "#0D7377" }}
                            >
                                {stats.totalUser}
                            </p>
                        </div>
                        <div
                            className="bg-white rounded-xl p-4"
                            style={{
                                boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                            }}
                        >
                            <p
                                className="text-xs font-medium"
                                style={{ color: "#9CA3AF" }}
                            >
                                Kunjungan Hari Ini
                            </p>
                            <p
                                className="text-lg font-bold mt-1"
                                style={{ color: "#0D7377" }}
                            >
                                {stats.kunjunganHariIni}
                            </p>
                        </div>
                        <div
                            className="bg-white rounded-xl p-4"
                            style={{
                                boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                            }}
                        >
                            <p
                                className="text-xs font-medium"
                                style={{ color: "#9CA3AF" }}
                            >
                                Total Kunjungan
                            </p>
                            <p
                                className="text-lg font-bold mt-1"
                                style={{ color: "#0D7377" }}
                            >
                                {stats.totalKunjungan}
                            </p>
                        </div>
                    </div>

                    {/* Kehadiran & Guru Belum Absen - 2 Grid Desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Grafik Donut */}
                        <div
                            className="bg-white rounded-xl p-4"
                            style={{
                                boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                            }}
                        >
                            <h3
                                className="font-bold text-sm mb-3"
                                style={{ color: "#1F2937" }}
                            >
                                Kehadiran Hari Ini
                            </h3>
                            <div className="flex flex-col items-center">
                                <div
                                    className="w-28 h-28 rounded-full relative"
                                    style={{
                                        background: `conic-gradient(#22C55E 0% ${stats.persentaseHadir}%, #EF4444 ${stats.persentaseHadir}% 100%)`,
                                    }}
                                >
                                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                                        <span
                                            className="text-lg font-bold"
                                            style={{ color: "#0D7377" }}
                                        >
                                            {stats.persentaseHadir}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-3">
                                    <div className="flex items-center gap-1.5">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ background: "#22C55E" }}
                                        />
                                        <span
                                            className="text-xs"
                                            style={{ color: "#9CA3AF" }}
                                        >
                                            Hadir
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ background: "#EF4444" }}
                                        />
                                        <span
                                            className="text-xs"
                                            style={{ color: "#9CA3AF" }}
                                        >
                                            Belum
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guru Belum Absen */}
                        <div
                            className="bg-white rounded-xl p-4"
                            style={{
                                boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                            }}
                        >
                            <h3
                                className="font-bold text-sm mb-3"
                                style={{ color: "#1F2937" }}
                            >
                                Guru Belum Absen
                            </h3>
                            {belumAbsenList.length === 0 ? (
                                <p
                                    className="text-xs text-center py-4"
                                    style={{ color: "#9CA3AF" }}
                                >
                                    Semua guru sudah absen ✓
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {belumAbsenList.map((guru) => (
                                        <div
                                            key={guru.id}
                                            className="flex items-center justify-between py-2 border-b last:border-0"
                                            style={{ borderColor: "#F0FDFA" }}
                                        >
                                            <div>
                                                <p
                                                    className="text-sm font-medium"
                                                    style={{ color: "#1F2937" }}
                                                >
                                                    {guru.name}
                                                </p>
                                                <p
                                                    className="text-xs"
                                                    style={{ color: "#9CA3AF" }}
                                                >
                                                    {guru.jabatan || "-"}
                                                </p>
                                            </div>
                                            <span
                                                className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold"
                                                style={{
                                                    background: "#FEE2E2",
                                                    color: "#DC2626",
                                                }}
                                            >
                                                Belum
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kehadiran Mingguan - Line Chart */}
                    <div
                        className="bg-white rounded-xl p-4"
                        style={{
                            boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                        }}
                    >
                        <h3
                            className="font-bold text-sm mb-3"
                            style={{ color: "#1F2937" }}
                        >
                            Kehadiran 7 Hari Terakhir
                        </h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={kehadiranMingguan}>
                                <XAxis
                                    dataKey="tanggal"
                                    tick={{ fontSize: 10, fill: "#9CA3AF" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: "#9CA3AF" }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={20}
                                />
                                <Tooltip
                                    contentStyle={{
                                        fontSize: 12,
                                        borderRadius: 8,
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="jumlah"
                                    stroke="#0D7377"
                                    strokeWidth={2.5}
                                    dot={{ fill: "#0D7377", r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Aktivitas Terbaru */}
                    <div
                        className="bg-white rounded-xl p-4"
                        style={{
                            boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                        }}
                    >
                        <h3
                            className="font-bold text-sm mb-3"
                            style={{ color: "#1F2937" }}
                        >
                            Aktivitas Terbaru
                        </h3>
                        {aktivitasTerbaru?.length === 0 || !aktivitasTerbaru ? (
                            <p
                                className="text-xs text-center py-4"
                                style={{ color: "#9CA3AF" }}
                            >
                                Belum ada aktivitas
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {aktivitasTerbaru.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 py-2 border-b last:border-0"
                                        style={{ borderColor: "#F0FDFA" }}
                                    >
                                        <div
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ background: item.warna }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-xs font-medium truncate"
                                                style={{ color: "#1F2937" }}
                                            >
                                                {item.nama}
                                            </p>
                                            <p
                                                className="text-[10px]"
                                                style={{ color: "#9CA3AF" }}
                                            >
                                                {item.aktivitas}
                                            </p>
                                        </div>
                                        <span
                                            className="text-xs font-semibold flex-shrink-0"
                                            style={{ color: "#9CA3AF" }}
                                        >
                                            {item.waktu}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }

    // ============ GURU VIEW ============
    return (
        <GuruDashboardView
            presensiBulan={presensiBulan}
            statistikBulan={statistikBulan}
            presensiToday={presensiToday}
            izinHariIni={izinHariIni}
            bulan={bulan}
            tahun={tahun}
            namaBulan={namaBulan}
            riwayatPresensi={riwayatPresensi}
            user={user}
            jam={jam}
        />
    );
}

// Guru View Component
function GuruDashboardView({
    presensiBulan,
    statistikBulan,
    presensiToday,
    izinHariIni,
    bulan,
    tahun,
    namaBulan,
    riwayatPresensi,
    user,
    jam,
}) {
    const [currentBulan, setCurrentBulan] = useState(parseInt(bulan));
    const [currentTahun, setCurrentTahun] = useState(parseInt(tahun));

    const hari = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const getDaysInMonth = (bln, thn) => new Date(thn, bln, 0).getDate();
    const getFirstDay = (bln, thn) => {
        const day = new Date(thn, bln - 1, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const getPresensiByTanggal = (tanggal) => {
        return presensiBulan?.find((p) => {
            const tgl = new Date(p.tanggal);
            return (
                tgl.getDate() === tanggal &&
                tgl.getMonth() + 1 === currentBulan &&
                tgl.getFullYear() === currentTahun
            );
        });
    };

    const renderKalender = () => {
        const daysInMonth = getDaysInMonth(currentBulan, currentTahun);
        const firstDay = getFirstDay(currentBulan, currentTahun);
        const cells = [];

        for (let i = 0; i < firstDay; i++) {
            cells.push(
                <div
                    key={`empty-${i}`}
                    className="h-16 border"
                    style={{ background: "#F8FAFD", borderColor: "#CCFBF1" }}
                />,
            );
        }

        for (let tanggal = 1; tanggal <= daysInMonth; tanggal++) {
            const data = getPresensiByTanggal(tanggal);
            cells.push(
                <div
                    key={tanggal}
                    className="h-16 border p-1"
                    style={{
                        borderColor: "#CCFBF1",
                        background: data ? "#FFFFFF" : "#F8FAFD",
                    }}
                >
                    <div
                        className="text-[10px] font-semibold mb-0.5"
                        style={{ color: "#9CA3AF" }}
                    >
                        {tanggal}
                    </div>
                    <div className="space-y-0.5">
                        <div
                            className={`h-1 rounded-full ${data?.jam_datang ? "bg-green-500" : "bg-gray-200"}`}
                        />
                        <div
                            className={`h-1 rounded-full ${data?.jam_pulang ? "bg-blue-500" : "bg-gray-200"}`}
                        />
                        <div
                            className={`h-1 rounded-full ${data?.keterangan ? "bg-yellow-500" : "bg-gray-200"}`}
                        />
                    </div>
                </div>,
            );
        }

        return cells;
    };

    return (
        <>
            <div className="space-y-4">
                {/* Header Card */}
                <div
                    className="rounded-2xl px-5 py-5 text-white relative overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(135deg, #2DD4BF 0%, #14B8A6 50%, #0D7377 100%)",
                        boxShadow: "0 8px 25px rgba(13,115,119,0.3)",
                    }}
                >
                    <div
                        className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                    />
                    <div
                        className="absolute -bottom-10 -left-4 w-24 h-24 rounded-full"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                    />
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <div>
                                <p
                                    className="text-xs font-medium"
                                    style={{ color: "rgba(255,255,255,0.8)" }}
                                >
                                    Selamat Datang, {user?.name}
                                </p>
                                <h2 className="text-xl font-bold mt-1">
                                    Dashboard Guru
                                </h2>
                                <p className="text-sm font-bold mt-1">
                                    {jam.toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })}
                                </p>
                                <p
                                    className="text-xs mt-1"
                                    style={{ color: "rgba(255,255,255,0.7)" }}
                                >
                                    {new Date().toLocaleDateString("id-ID", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                {presensiToday ? (
                                    <CheckCircle2 size={24} color="#fff" />
                                ) : (
                                    <Clock size={24} color="#fff" />
                                )}
                            </div>
                        </div>
                        <p
                            className="text-xs mt-2"
                            style={{ color: "rgba(255,255,255,0.7)" }}
                        >
                            {izinHariIni
                                ? `Anda ${izinHariIni.jenis_izin} hari ini`
                                : presensiToday
                                  ? "Semangat mengajar hari ini!"
                                  : "Jangan lupa absen ya!"}
                        </p>
                    </div>
                </div>

                {/* Statistik Bulanan */}
                <div className="grid grid-cols-3 gap-2">
                    <div
                        className="bg-white rounded-xl p-3 text-center"
                        style={{
                            boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                        }}
                    >
                        <p
                            className="text-lg font-bold"
                            style={{ color: "#22C55E" }}
                        >
                            {statistikBulan.hadir}
                        </p>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>
                            Hadir
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-xl p-3 text-center"
                        style={{
                            boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                        }}
                    >
                        <p
                            className="text-lg font-bold"
                            style={{ color: "#F59E0B" }}
                        >
                            {statistikBulan.izin}
                        </p>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>
                            Izin
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-xl p-3 text-center"
                        style={{
                            boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                        }}
                    >
                        <p
                            className="text-lg font-bold"
                            style={{ color: "#EF4444" }}
                        >
                            {statistikBulan.sakit}
                        </p>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>
                            Sakit
                        </p>
                    </div>
                </div>

                {/* Kalender */}
                <div
                    className="bg-white rounded-xl p-4"
                    style={{ boxShadow: "0 4px 12px rgba(13,115,119,0.06)" }}
                >
                    <div className="text-center mb-3">
                        <h3
                            className="font-bold text-sm"
                            style={{ color: "#1F2937" }}
                        >
                            {namaBulan[currentBulan - 1]} {currentTahun}
                        </h3>
                    </div>
                    <div
                        className="grid grid-cols-7 gap-px"
                        style={{ background: "#CCFBF1" }}
                    >
                        {hari.map((h) => (
                            <div
                                key={h}
                                className="text-center py-1.5 text-[10px] font-semibold text-white"
                                style={{ background: "#14B8A6" }}
                            >
                                {h}
                            </div>
                        ))}
                        {renderKalender()}
                    </div>
                    <div
                        className="flex flex-wrap gap-3 mt-3 text-[10px]"
                        style={{ color: "#9CA3AF" }}
                    >
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-1 rounded-full bg-green-500" />{" "}
                            Datang
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-1 rounded-full bg-blue-500" />{" "}
                            Pulang
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-1 rounded-full bg-yellow-500" />{" "}
                            Keterangan
                        </div>
                    </div>
                </div>

                {/* Riwayat Presensi */}
                <div
                    className="bg-white rounded-xl p-4"
                    style={{ boxShadow: "0 4px 12px rgba(13,115,119,0.06)" }}
                >
                    <h3
                        className="font-bold text-sm mb-3"
                        style={{ color: "#1F2937" }}
                    >
                        Riwayat Presensi
                    </h3>
                    {riwayatPresensi?.length === 0 ? (
                        <p
                            className="text-xs text-center py-4"
                            style={{ color: "#9CA3AF" }}
                        >
                            Belum ada riwayat presensi
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {riwayatPresensi?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-2 border-b last:border-0"
                                    style={{ borderColor: "#F0FDFA" }}
                                >
                                    <div>
                                        <p
                                            className="text-sm font-medium"
                                            style={{ color: "#1F2937" }}
                                        >
                                            {item.tanggal}
                                        </p>
                                        <p
                                            className="text-xs"
                                            style={{ color: "#9CA3AF" }}
                                        >
                                            {item.jam_datang} -{" "}
                                            {item.jam_pulang}
                                        </p>
                                    </div>
                                    <span
                                        className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold"
                                        style={{
                                            background:
                                                item.status === "Lengkap"
                                                    ? "#DCFCE7"
                                                    : "#FEF3C7",
                                            color:
                                                item.status === "Lengkap"
                                                    ? "#16A34A"
                                                    : "#D97706",
                                        }}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page) => <AppLayout header="Dashboard">{page}</AppLayout>;

export default Dashboard;
