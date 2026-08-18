import React, { useState } from "react";
import AppLayout from "./Layouts/AppLayout";

function Rekap({ guruList, presensi, filter }) {
    const [selectedGuru, setSelectedGuru] = useState(filter.user_id || "");
    const [bulan, setBulan] = useState(
        parseInt(filter.bulan) || new Date().getMonth() + 1,
    );
    const [tahun, setTahun] = useState(
        parseInt(filter.tahun) || new Date().getFullYear(),
    );
    const [selectedDetail, setSelectedDetail] = useState(null);

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

    const hari = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

    const getDaysInMonth = (bln, thn) => new Date(thn, bln, 0).getDate();

    const getFirstDay = (bln, thn) => {
        const day = new Date(thn, bln - 1, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const handleFilterGuru = (e) => {
        const userId = e.target.value;
        setSelectedGuru(userId);
        window.location.href = `/rekap?user_id=${userId}&bulan=${bulan}&tahun=${tahun}`;
    };

    const prevBulan = () => {
        let newBulan = bulan - 1;
        let newTahun = tahun;
        if (newBulan < 1) {
            newBulan = 12;
            newTahun = tahun - 1;
        }
        setBulan(newBulan);
        setTahun(newTahun);
        window.location.href = `/rekap?user_id=${selectedGuru}&bulan=${newBulan}&tahun=${newTahun}`;
    };

    const nextBulan = () => {
        let newBulan = bulan + 1;
        let newTahun = tahun;
        if (newBulan > 12) {
            newBulan = 1;
            newTahun = tahun + 1;
        }
        setBulan(newBulan);
        setTahun(newTahun);
        window.location.href = `/rekap?user_id=${selectedGuru}&bulan=${newBulan}&tahun=${newTahun}`;
    };

    const getPresensiByTanggal = (tanggal) => {
        return presensi.find((p) => {
            const tgl = new Date(p.tanggal);
            return (
                tgl.getDate() === tanggal &&
                tgl.getMonth() + 1 === bulan &&
                tgl.getFullYear() === tahun
            );
        });
    };

    const renderKalender = () => {
        const daysInMonth = getDaysInMonth(bulan, tahun);
        const firstDay = getFirstDay(bulan, tahun);
        const cells = [];

        for (let i = 0; i < firstDay; i++) {
            cells.push(
                <div
                    key={`empty-${i}`}
                    className="h-24 border"
                    style={{ background: "#F0FDFA", borderColor: "#CCFBF1" }}
                />,
            );
        }

        for (let tanggal = 1; tanggal <= daysInMonth; tanggal++) {
            const data = getPresensiByTanggal(tanggal);
            cells.push(
                <div
                    key={tanggal}
                    onClick={() => data && setSelectedDetail(data)}
                    className="h-24 border p-1.5 transition-colors"
                    style={{
                        borderColor: "#CCFBF1",
                        background: data ? "#FFFFFF" : "#F0FDFA",
                        cursor: data ? "pointer" : "default",
                    }}
                >
                    <div
                        className="text-xs font-semibold mb-1"
                        style={{ color: "#9CA3AF" }}
                    >
                        {tanggal}
                    </div>
                    <div className="space-y-1">
                        <div
                            className={`h-1.5 rounded-full ${data?.jam_datang ? "bg-green-500" : "bg-gray-200"}`}
                        />
                        <div
                            className={`h-1.5 rounded-full ${data?.jam_pulang ? "bg-blue-500" : "bg-gray-200"}`}
                        />
                        <div
                            className={`h-1.5 rounded-full ${data?.keterangan ? "bg-yellow-500" : "bg-gray-200"}`}
                        />
                    </div>
                </div>,
            );
        }

        return cells;
    };

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h2
                        className="text-2xl font-bold"
                        style={{ color: "#1F2937" }}
                    >
                        Rekap Presensi
                    </h2>
                    <div className="flex gap-2">
                        <a
                            href={`/rekap/export-excel?user_id=${selectedGuru}&bulan=${bulan}&tahun=${tahun}`}
                            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                            style={{
                                background: "#FFFFFF",
                                color: "#0D7377",
                                boxShadow: "0 4px 12px rgba(13,115,119,0.08)",
                            }}
                        >
                            Export Excel
                        </a>
                        <a
                            href={`/rekap/export-pdf?user_id=${selectedGuru}&bulan=${bulan}&tahun=${tahun}`}
                            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
                            style={{
                                background:
                                    "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                boxShadow: "0 4px 12px rgba(13,115,119,0.3)",
                            }}
                        >
                            Export PDF
                        </a>
                    </div>
                </div>

                {/* Filter Guru */}
                <div
                    className="bg-white rounded-2xl p-5"
                    style={{ boxShadow: "0 8px 20px rgba(13,115,119,0.08)" }}
                >
                    <label
                        className="block text-xs font-semibold mb-2"
                        style={{ color: "#1F2937" }}
                    >
                        Pilih Guru
                    </label>
                    <select
                        value={selectedGuru}
                        onChange={handleFilterGuru}
                        className="w-full px-4 py-3 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                        style={{ color: "#1F2937" }}
                    >
                        <option value="">Semua Guru</option>
                        {guruList.map((guru) => (
                            <option key={guru.id} value={guru.id}>
                                {guru.name} - {guru.jabatan || "Tanpa Jabatan"}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Kalender */}
                <div
                    className="bg-white rounded-2xl p-5"
                    style={{ boxShadow: "0 8px 20px rgba(13,115,119,0.08)" }}
                >
                    {/* Navigasi Bulan */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={prevBulan}
                            className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                            style={{ background: "#CCFBF1", color: "#0D7377" }}
                        >
                            ←
                        </button>
                        <h3
                            className="text-lg font-bold"
                            style={{ color: "#1F2937" }}
                        >
                            {namaBulan[bulan - 1]} {tahun}
                        </h3>
                        <button
                            onClick={nextBulan}
                            className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                            style={{ background: "#CCFBF1", color: "#0D7377" }}
                        >
                            →
                        </button>
                    </div>

                    {/* Legend */}
                    <div
                        className="flex flex-wrap gap-4 mb-4 text-xs"
                        style={{ color: "#9CA3AF" }}
                    >
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1.5 rounded-full bg-green-500" />
                            Datang
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1.5 rounded-full bg-blue-500" />
                            Pulang
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1.5 rounded-full bg-yellow-500" />
                            Keterangan
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1.5 rounded-full bg-gray-200" />
                            Tidak ada
                        </div>
                    </div>

                    {/* Grid Kalender */}
                    <div
                        className="grid grid-cols-7 gap-px"
                        style={{ background: "#CCFBF1" }}
                    >
                        {hari.map((h) => (
                            <div
                                key={h}
                                className="text-center py-2 text-xs font-semibold text-white"
                                style={{ background: "#14B8A6" }}
                            >
                                {h}
                            </div>
                        ))}
                        {renderKalender()}
                    </div>
                </div>

                {/* Modal Detail */}
                {selectedDetail && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setSelectedDetail(null)}
                    >
                        <div
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3
                                className="font-bold text-lg mb-4"
                                style={{ color: "#1F2937" }}
                            >
                                {new Date(
                                    selectedDetail.tanggal,
                                ).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </h3>
                            <div className="space-y-3">
                                <div
                                    className="p-3 rounded-xl"
                                    style={{ background: "#F0FDFA" }}
                                >
                                    <p
                                        className="text-xs font-semibold mb-1"
                                        style={{ color: "#9CA3AF" }}
                                    >
                                        Datang
                                    </p>
                                    <p
                                        className="text-sm"
                                        style={{ color: "#1F2937" }}
                                    >
                                        Jam:{" "}
                                        {selectedDetail.jam_datang
                                            ? new Date(
                                                  selectedDetail.jam_datang,
                                              ).toLocaleTimeString("id-ID")
                                            : "-"}
                                    </p>
                                    <p
                                        className="text-sm"
                                        style={{ color: "#1F2937" }}
                                    >
                                        Lokasi: {selectedDetail.lat_datang},{" "}
                                        {selectedDetail.long_datang}
                                    </p>
                                </div>
                                <div
                                    className="p-3 rounded-xl"
                                    style={{ background: "#F0FDFA" }}
                                >
                                    <p
                                        className="text-xs font-semibold mb-1"
                                        style={{ color: "#9CA3AF" }}
                                    >
                                        Pulang
                                    </p>
                                    <p
                                        className="text-sm"
                                        style={{ color: "#1F2937" }}
                                    >
                                        Jam:{" "}
                                        {selectedDetail.jam_pulang
                                            ? new Date(
                                                  selectedDetail.jam_pulang,
                                              ).toLocaleTimeString("id-ID")
                                            : "-"}
                                    </p>
                                    <p
                                        className="text-sm"
                                        style={{ color: "#1F2937" }}
                                    >
                                        Lokasi: {selectedDetail.lat_pulang},{" "}
                                        {selectedDetail.long_pulang}
                                    </p>
                                </div>
                                <div
                                    className="p-3 rounded-xl"
                                    style={{ background: "#F0FDFA" }}
                                >
                                    <p
                                        className="text-xs font-semibold mb-1"
                                        style={{ color: "#9CA3AF" }}
                                    >
                                        Keterangan
                                    </p>
                                    <p
                                        className="text-sm"
                                        style={{ color: "#1F2937" }}
                                    >
                                        {selectedDetail.keterangan || "-"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDetail(null)}
                                className="w-full py-3 rounded-full text-white font-semibold text-sm mt-4"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                }}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Rekap.layout = (page) => <AppLayout header="Rekap Presensi">{page}</AppLayout>;

export default Rekap;
