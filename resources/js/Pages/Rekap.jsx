import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "./Layouts/AppLayout";

function Rekap({
    isAdmin,
    tab: initialTab,
    tanggal: initialTanggal,
    rekapData,
    guruList,
    presensi,
    filter,
}) {
    const [activeTab, setActiveTab] = useState(initialTab || "harian");
    const [tanggal, setTanggal] = useState(
        initialTanggal || new Date().toLocaleDateString("en-CA"),
    );
    const [selectedFoto, setSelectedFoto] = useState(null);
    const [selectedDetail, setSelectedDetail] = useState(null);

    // ============ ADMIN VIEW ============
    if (isAdmin) {
        const handleTabChange = (newTab) => {
            setActiveTab(newTab);
            router.get(
                "/rekap",
                { tab: newTab, tanggal },
                { preserveState: true },
            );
        };

        const handleTanggalChange = (e) => {
            const newTanggal = e.target.value;
            setTanggal(newTanggal);
            router.get(
                "/rekap",
                { tab: "harian", tanggal: newTanggal },
                { preserveState: true },
            );
        };

        return (
            <>
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h2
                            className="text-lg font-bold"
                            style={{ color: "#1F2937" }}
                        >
                            Rekap Presensi
                        </h2>
                    </div>

                    {/* Tab */}
                    <div
                        className="flex gap-2 bg-white rounded-full p-1"
                        style={{
                            boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                        }}
                    >
                        {["harian", "mingguan", "bulanan"].map((t) => (
                            <button
                                key={t}
                                onClick={() => handleTabChange(t)}
                                className="flex-1 py-2 rounded-full text-xs font-semibold capitalize transition-all"
                                style={{
                                    background:
                                        activeTab === t
                                            ? "linear-gradient(135deg, #2DD4BF, #0D7377)"
                                            : "transparent",
                                    color:
                                        activeTab === t ? "#FFFFFF" : "#9CA3AF",
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Pilih Tanggal (Harian only) */}
                    {activeTab === "harian" && (
                        <div
                            className="bg-white rounded-xl p-4"
                            style={{
                                boxShadow: "0 4px 12px rgba(13,115,119,0.06)",
                            }}
                        >
                            <label
                                className="block text-xs font-semibold mb-2"
                                style={{ color: "#1F2937" }}
                            >
                                Pilih Tanggal
                            </label>
                            <input
                                type="date"
                                value={tanggal}
                                onChange={handleTanggalChange}
                                className="w-full px-4 py-2.5 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                style={{ color: "#1F2937" }}
                            />
                        </div>
                    )}

                    {/* Card List */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {activeTab === "harian"
                            ? // Harian: card per guru + lihat foto
                              rekapData?.map((item) => (
                                  <div
                                      key={item.user_id}
                                      className="bg-white rounded-xl p-4"
                                      style={{
                                          boxShadow:
                                              "0 4px 12px rgba(13,115,119,0.06)",
                                      }}
                                  >
                                      <div className="flex items-center gap-3 mb-3">
                                          <div
                                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                              style={{
                                                  background:
                                                      "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                              }}
                                          >
                                              {item.nama.charAt(0)}
                                          </div>
                                          <div>
                                              <p
                                                  className="text-sm font-semibold"
                                                  style={{ color: "#1F2937" }}
                                              >
                                                  {item.nama}
                                              </p>
                                              <p
                                                  className="text-xs"
                                                  style={{ color: "#9CA3AF" }}
                                              >
                                                  {item.jabatan || "-"}
                                              </p>
                                          </div>
                                      </div>

                                      {item.jenis_izin ? (
                                          <div
                                              className="p-2 rounded-lg mb-2"
                                              style={{ background: "#FEF3C7" }}
                                          >
                                              <p
                                                  className="text-xs font-semibold capitalize"
                                                  style={{ color: "#D97706" }}
                                              >
                                                  {item.jenis_izin}
                                              </p>
                                              <p
                                                  className="text-xs"
                                                  style={{ color: "#92400E" }}
                                              >
                                                  {item.keterangan}
                                              </p>
                                          </div>
                                      ) : (
                                          <div className="space-y-1.5 mb-3">
                                              <div className="flex justify-between items-center text-xs">
                                                  <span
                                                      style={{
                                                          color: "#9CA3AF",
                                                      }}
                                                  >
                                                      Jam Masuk
                                                  </span>
                                                  <span
                                                      className="font-semibold"
                                                      style={{
                                                          color: "#1F2937",
                                                      }}
                                                  >
                                                      {item.jam_datang}
                                                  </span>
                                              </div>
                                              <div className="flex justify-between items-center text-xs">
                                                  <span
                                                      style={{
                                                          color: "#9CA3AF",
                                                      }}
                                                  >
                                                      Jam Pulang
                                                  </span>
                                                  <span
                                                      className="font-semibold"
                                                      style={{
                                                          color: "#1F2937",
                                                      }}
                                                  >
                                                      {item.jam_pulang}
                                                  </span>
                                              </div>
                                          </div>
                                      )}

                                      {!item.jenis_izin && (
                                          <div className="grid grid-cols-2 gap-2">
                                              <button
                                                  onClick={() =>
                                                      item.foto_datang &&
                                                      setSelectedFoto({
                                                          type: "Masuk",
                                                          foto: item.foto_datang,
                                                      })
                                                  }
                                                  disabled={!item.foto_datang}
                                                  className="py-2 rounded-full text-xs font-semibold disabled:opacity-40"
                                                  style={{
                                                      background: "#F0FDFA",
                                                      color: "#0D7377",
                                                  }}
                                              >
                                                  Lihat Foto Masuk
                                              </button>
                                              <button
                                                  onClick={() =>
                                                      item.foto_pulang &&
                                                      setSelectedFoto({
                                                          type: "Pulang",
                                                          foto: item.foto_pulang,
                                                      })
                                                  }
                                                  disabled={!item.foto_pulang}
                                                  className="py-2 rounded-full text-xs font-semibold disabled:opacity-40"
                                                  style={{
                                                      background: "#F0FDFA",
                                                      color: "#0D7377",
                                                  }}
                                              >
                                                  Lihat Foto Pulang
                                              </button>
                                          </div>
                                      )}
                                  </div>
                              ))
                            : // Mingguan & Bulanan: statistik per guru
                              rekapData?.map((item) => (
                                  <div
                                      key={item.user_id}
                                      className="bg-white rounded-xl p-4"
                                      style={{
                                          boxShadow:
                                              "0 4px 12px rgba(13,115,119,0.06)",
                                      }}
                                  >
                                      <div className="flex items-center gap-3 mb-3">
                                          <div
                                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                              style={{
                                                  background:
                                                      "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                              }}
                                          >
                                              {item.nama.charAt(0)}
                                          </div>
                                          <div>
                                              <p
                                                  className="text-sm font-semibold"
                                                  style={{ color: "#1F2937" }}
                                              >
                                                  {item.nama}
                                              </p>
                                              <p
                                                  className="text-xs"
                                                  style={{ color: "#9CA3AF" }}
                                              >
                                                  {item.jabatan || "-"}
                                              </p>
                                          </div>
                                      </div>
                                      <div className="grid grid-cols-3 gap-2 text-center">
                                          <div
                                              className="p-2 rounded-lg"
                                              style={{ background: "#DCFCE7" }}
                                          >
                                              <p
                                                  className="text-lg font-bold"
                                                  style={{ color: "#16A34A" }}
                                              >
                                                  {item.lengkap}
                                              </p>
                                              <p
                                                  className="text-[10px]"
                                                  style={{ color: "#16A34A" }}
                                              >
                                                  Lengkap
                                              </p>
                                          </div>
                                          <div
                                              className="p-2 rounded-lg"
                                              style={{ background: "#FEF3C7" }}
                                          >
                                              <p
                                                  className="text-lg font-bold"
                                                  style={{ color: "#D97706" }}
                                              >
                                                  {item.datang_saja}
                                              </p>
                                              <p
                                                  className="text-[10px]"
                                                  style={{ color: "#D97706" }}
                                              >
                                                  Datang
                                              </p>
                                          </div>
                                          <div
                                              className="p-2 rounded-lg"
                                              style={{ background: "#DBEAFE" }}
                                          >
                                              <p
                                                  className="text-lg font-bold"
                                                  style={{ color: "#2563EB" }}
                                              >
                                                  {item.pulang_saja}
                                              </p>
                                              <p
                                                  className="text-[10px]"
                                                  style={{ color: "#2563EB" }}
                                              >
                                                  Pulang
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                    </div>

                    {/* Popup Foto */}
                    {selectedFoto && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                            onClick={() => setSelectedFoto(null)}
                        >
                            <div
                                className="bg-white rounded-2xl max-w-md w-full p-5"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3
                                    className="font-bold text-base mb-3"
                                    style={{ color: "#1F2937" }}
                                >
                                    Foto {selectedFoto.type}
                                </h3>
                                <img
                                    src={selectedFoto.foto}
                                    alt={`Foto ${selectedFoto.type}`}
                                    className="w-full rounded-xl"
                                />
                                <button
                                    onClick={() => setSelectedFoto(null)}
                                    className="w-full py-2.5 rounded-full text-white font-semibold text-sm mt-3"
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

    // ============ GURU VIEW ============
    return <GuruRekapView presensi={presensi} filter={filter} />;
}

// Guru View
function GuruRekapView({ presensi, filter }) {
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

    const prevBulan = () => {
        let newBulan = bulan - 1;
        let newTahun = tahun;
        if (newBulan < 1) {
            newBulan = 12;
            newTahun = tahun - 1;
        }
        setBulan(newBulan);
        setTahun(newTahun);
        router.get(
            "/rekap",
            { bulan: newBulan, tahun: newTahun },
            { preserveState: true },
        );
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
        router.get(
            "/rekap",
            { bulan: newBulan, tahun: newTahun },
            { preserveState: true },
        );
    };

    const getPresensiByTanggal = (tanggal) => {
        return presensi?.find((p) => {
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
                    onClick={() => data && setSelectedDetail(data)}
                    className="h-16 border p-1"
                    style={{
                        borderColor: "#CCFBF1",
                        background: data ? "#FFFFFF" : "#F8FAFD",
                        cursor: data ? "pointer" : "default",
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
                <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>
                    Rekap Presensi
                </h2>

                <div
                    className="bg-white rounded-xl p-4"
                    style={{ boxShadow: "0 4px 12px rgba(13,115,119,0.06)" }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={prevBulan}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: "#CCFBF1", color: "#0D7377" }}
                        >
                            ←
                        </button>
                        <h3
                            className="text-sm font-bold"
                            style={{ color: "#1F2937" }}
                        >
                            {namaBulan[bulan - 1]} {tahun}
                        </h3>
                        <button
                            onClick={nextBulan}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: "#CCFBF1", color: "#0D7377" }}
                        >
                            →
                        </button>
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

                {selectedDetail && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setSelectedDetail(null)}
                    >
                        <div
                            className="bg-white rounded-2xl max-w-md w-full p-5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3
                                className="font-bold text-base mb-3"
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
                            <div className="space-y-2">
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
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDetail(null)}
                                className="w-full py-2.5 rounded-full text-white font-semibold text-sm mt-3"
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
