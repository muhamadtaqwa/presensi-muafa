import React, { useState } from "react";

export default function KalenderPresensi({ presensi, bulan, tahun }) {
    const [currentBulan, setCurrentBulan] = useState(parseInt(bulan));
    const [currentTahun, setCurrentTahun] = useState(parseInt(tahun));
    const [selectedTanggal, setSelectedTanggal] = useState(null);

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

    const getDaysInMonth = (bulan, tahun) => {
        return new Date(tahun, bulan, 0).getDate();
    };

    const getFirstDay = (bulan, tahun) => {
        const day = new Date(tahun, bulan - 1, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const prevBulan = () => {
        if (currentBulan === 1) {
            setCurrentBulan(12);
            setCurrentTahun(currentTahun - 1);
        } else {
            setCurrentBulan(currentBulan - 1);
        }
        updateUrl(
            currentBulan - 1 === 0 ? 12 : currentBulan - 1,
            currentBulan === 1 ? currentTahun - 1 : currentTahun,
        );
    };

    const nextBulan = () => {
        if (currentBulan === 12) {
            setCurrentBulan(1);
            setCurrentTahun(currentTahun + 1);
        } else {
            setCurrentBulan(currentBulan + 1);
        }
        updateUrl(
            currentBulan + 1 === 13 ? 1 : currentBulan + 1,
            currentBulan === 12 ? currentTahun + 1 : currentTahun,
        );
    };

    const updateUrl = (bln, thn) => {
        const url = new URL(window.location.href);
        url.searchParams.set("bulan", bln);
        url.searchParams.set("tahun", thn);
        window.history.pushState({}, "", url);
        window.location.reload();
    };

    const getPresensiByTanggal = (tanggal) => {
        return presensi.find((p) => {
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

        // Empty cells
        for (let i = 0; i < firstDay; i++) {
            cells.push(
                <div key={`empty-${i}`} className="h-24 border bg-gray-50" />,
            );
        }

        // Date cells
        for (let tanggal = 1; tanggal <= daysInMonth; tanggal++) {
            const data = getPresensiByTanggal(tanggal);
            cells.push(
                <div
                    key={tanggal}
                    onClick={() => data && setSelectedTanggal(data)}
                    className={`h-24 border p-1.5 cursor-pointer transition-colors hover:bg-primary-50 ${data ? "bg-white" : "bg-gray-50"}`}
                >
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                        {tanggal}
                    </div>
                    <div className="space-y-0.5">
                        {/* Garis 1: Datang */}
                        <div
                            className={`h-1 rounded ${data?.jam_datang ? "bg-green-500" : "bg-gray-200"}`}
                        />
                        {/* Garis 2: Pulang */}
                        <div
                            className={`h-1 rounded ${data?.jam_pulang ? "bg-blue-500" : "bg-gray-200"}`}
                        />
                        {/* Garis 3: Keterangan */}
                        <div
                            className={`h-1 rounded ${data?.keterangan ? "bg-yellow-500" : "bg-gray-200"}`}
                        />
                    </div>
                </div>,
            );
        }

        return cells;
    };

    return (
        <div className="card">
            {/* Header Kalender */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prevBulan}
                    className="btn-secondary text-sm px-3 py-2"
                >
                    ◀
                </button>
                <h3 className="text-lg font-bold text-gray-800">
                    {namaBulan[currentBulan - 1]} {currentTahun}
                </h3>
                <button
                    onClick={nextBulan}
                    className="btn-secondary text-sm px-3 py-2"
                >
                    ▶
                </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-1 bg-green-500 rounded" />
                    <span>Datang</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-1 bg-blue-500 rounded" />
                    <span>Pulang</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-1 bg-yellow-500 rounded" />
                    <span>Keterangan</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-1 bg-gray-200 rounded" />
                    <span>Tidak ada</span>
                </div>
            </div>

            {/* Grid Kalender */}
            <div className="grid grid-cols-7 gap-px bg-gray-200">
                {hari.map((h) => (
                    <div
                        key={h}
                        className="bg-primary-600 text-white text-center py-2 text-xs font-semibold"
                    >
                        {h}
                    </div>
                ))}
                {renderKalender()}
            </div>

            {/* Modal Detail */}
            {selectedTanggal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
                    onClick={() => setSelectedTanggal(null)}
                >
                    <div
                        className="bg-white rounded-xl max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="font-bold text-lg mb-4">
                            📅{" "}
                            {new Date(
                                selectedTanggal.tanggal,
                            ).toLocaleDateString("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">
                                    Datang
                                </p>
                                <p className="text-sm">
                                    🕐{" "}
                                    {selectedTanggal.jam_datang
                                        ? new Date(
                                              selectedTanggal.jam_datang,
                                          ).toLocaleTimeString("id-ID")
                                        : "-"}
                                </p>
                                <p className="text-sm">
                                    📍 {selectedTanggal.lat_datang},{" "}
                                    {selectedTanggal.long_datang}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600">
                                    Pulang
                                </p>
                                <p className="text-sm">
                                    🕐{" "}
                                    {selectedTanggal.jam_pulang
                                        ? new Date(
                                              selectedTanggal.jam_pulang,
                                          ).toLocaleTimeString("id-ID")
                                        : "-"}
                                </p>
                                <p className="text-sm">
                                    📍 {selectedTanggal.lat_pulang},{" "}
                                    {selectedTanggal.long_pulang}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600">
                                    Keterangan
                                </p>
                                <p className="text-sm">
                                    {selectedTanggal.keterangan || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600">
                                    Status
                                </p>
                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                    {selectedTanggal.status}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedTanggal(null)}
                            className="btn-secondary w-full mt-4"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
