import React, { useState, useRef, useEffect } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "./Layouts/AppLayout";
import toast from "react-hot-toast";

function Presensi({ presensi, izinHariIni, today, riwayat }) {
    const [jam, setJam] = useState(new Date());
    const [lokasi, setLokasi] = useState(null);
    const [loadingLokasi, setLoadingLokasi] = useState(true);
    const [jenisAbsen, setJenisAbsen] = useState(null);
    const [fotoDatang, setFotoDatang] = useState(null);
    const [fotoPulang, setFotoPulang] = useState(null);
    const [jamDatang, setJamDatang] = useState(null);
    const [jamPulang, setJamPulang] = useState(null);
    const [showKamera, setShowKamera] = useState(false);
    const [previewFoto, setPreviewFoto] = useState(null);
    // Default "user" karena kamera laptop pada dasarnya kamera depan/selfie.
    // Untuk HP, user tetap bisa switch ke "environment" (kamera belakang).
    const [facingMode, setFacingMode] = useState("user");
    const [processing, setProcessing] = useState(false);
    const [batalkanProcessing, setBatalkanProcessing] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => setJam(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLokasi({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                    });
                    setLoadingLokasi(false);
                },
                () => {
                    setLoadingLokasi(false);
                },
                { enableHighAccuracy: true, timeout: 10000 },
            );
        } else {
            setLoadingLokasi(false);
        }
    }, []);

    useEffect(() => {
        if (presensi) {
            if (presensi.foto_datang)
                setFotoDatang(`/storage/${presensi.foto_datang}`);
            if (presensi.foto_pulang)
                setFotoPulang(`/storage/${presensi.foto_pulang}`);
            if (presensi.jam_datang) {
                const tgl = new Date(presensi.jam_datang);
                setJamDatang(
                    tgl.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }),
                );
            }
            if (presensi.jam_pulang) {
                const tgl = new Date(presensi.jam_pulang);
                setJamPulang(
                    tgl.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }),
                );
            }
        }
    }, [presensi]);

    // Cleanup kamera kalau komponen unmount saat stream masih aktif
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        };
    }, []);

    // Ambil sudut orientasi layar saat ini (0, 90, 180, -90/270)
    // Dipakai untuk mengoreksi rotasi hasil capture di HP (landscape/portrait)
    const getOrientationAngle = () => {
        if (
            typeof screen !== "undefined" &&
            screen.orientation &&
            typeof screen.orientation.angle === "number"
        ) {
            return screen.orientation.angle;
        }
        if (
            typeof window !== "undefined" &&
            typeof window.orientation === "number"
        ) {
            return window.orientation;
        }
        return 0;
    };

    const getLokasi = () => {
        setLoadingLokasi(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLokasi({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                    });
                    setLoadingLokasi(false);
                    toast.success("Lokasi berhasil didapat");
                },
                () => {
                    setLoadingLokasi(false);
                    toast.error("Gagal mendapatkan lokasi");
                },
                { enableHighAccuracy: true, timeout: 10000 },
            );
        } else {
            setLoadingLokasi(false);
            toast.error("Browser tidak mendukung GPS");
        }
    };

    const bukaKamera = async (jenis) => {
        setJenisAbsen(jenis);
        setPreviewFoto(null);

        if (!lokasi) {
            toast.error("Ambil lokasi dulu sebelum absen");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode },
                audio: false,
            });
            streamRef.current = stream;
            setShowKamera(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            }, 100);
        } catch {
            toast.error("Kamera tidak tersedia atau izin ditolak");
        }
    };

    const switchKamera = async () => {
        const newMode = facingMode === "environment" ? "user" : "environment";
        setFacingMode(newMode);

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: newMode },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch {
            toast.error("Gagal switch kamera");
        }
    };

    const tutupKamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setShowKamera(false);
    };

    const ambilFoto = () => {
        const video = videoRef.current;
        if (!video) return;

        // Validasi ulang lokasi — bisa saja hilang setelah kamera dibuka
        if (!lokasi) {
            toast.error("Lokasi tidak tersedia, ambil lokasi ulang");
            tutupKamera();
            return;
        }

        const vw = video.videoWidth;
        const vh = video.videoHeight;
        if (!vw || !vh) return;

        // Koreksi rotasi berdasarkan orientasi layar (khusus HP).
        // Beberapa browser mobile tidak otomatis merotasi frame video
        // mentah sesuai orientasi fisik device, walau preview di layar
        // sudah terlihat "benar" secara visual (CSS-level).
        const angle = ((getOrientationAngle() % 360) + 360) % 360; // normalisasi 0-359
        const swapDims = angle === 90 || angle === 270;

        const canvas = document.createElement("canvas");
        canvas.width = swapDims ? vh : vw;
        canvas.height = swapDims ? vw : vh;
        const ctx = canvas.getContext("2d");

        ctx.save();

        // Pindahkan origin ke tengah canvas untuk rotasi & mirror
        ctx.translate(canvas.width / 2, canvas.height / 2);

        if (angle === 90) {
            ctx.rotate((-90 * Math.PI) / 180);
        } else if (angle === 180) {
            ctx.rotate((180 * Math.PI) / 180);
        } else if (angle === 270) {
            ctx.rotate((90 * Math.PI) / 180);
        }

        // Flip horizontal kalau kamera depan (selfie), supaya hasil foto
        // konsisten dengan apa yang dilihat user di preview (mirrored)
        if (facingMode === "user") {
            ctx.scale(-1, 1);
        }

        ctx.drawImage(video, -vw / 2, -vh / 2, vw, vh);
        ctx.restore();

        const koordinat = `${lokasi.lat}, ${lokasi.long}`;
        const waktu = jam.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(10, canvas.height - 70, canvas.width - 20, 60);
        ctx.fillStyle = "#fff";
        ctx.fillText(`Lokasi: ${koordinat}`, 20, canvas.height - 40);
        ctx.fillText(`Jam: ${waktu}`, 20, canvas.height - 15);

        setPreviewFoto(canvas.toDataURL("image/jpeg"));
        tutupKamera();
    };

    const submitAbsen = async () => {
        if (processing) return;

        if (!previewFoto) {
            toast.error("Foto wajib diambil");
            return;
        }

        if (!lokasi) {
            toast.error("Lokasi wajib didapatkan");
            return;
        }

        setProcessing(true);

        try {
            const blob = await fetch(previewFoto).then((res) => res.blob());

            const formData = new FormData();
            formData.append("tanggal", today);
            formData.append("status", "normal");

            if (jenisAbsen === "datang") {
                formData.append("jam_datang", jam.toTimeString().slice(0, 8));
                formData.append("lat_datang", lokasi.lat.toString());
                formData.append("long_datang", lokasi.long.toString());
                formData.append("foto_datang", blob, "datang.jpg");
            } else {
                formData.append("jam_pulang", jam.toTimeString().slice(0, 8));
                formData.append("lat_pulang", lokasi.lat.toString());
                formData.append("long_pulang", lokasi.long.toString());
                formData.append("foto_pulang", blob, "pulang.jpg");
            }

            router.post("/presensi", formData, {
                forceFormData: true,
                onSuccess: () => {
                    toast.success(`Absen ${jenisAbsen} berhasil disimpan`);
                    setTimeout(() => window.location.reload(), 1000);
                },
                onError: () => {
                    toast.error("Gagal menyimpan absen");
                    setProcessing(false);
                },
            });
        } catch (error) {
            toast.error("Gagal menyimpan absen");
            setProcessing(false);
        }
    };

    const batalkanAbsen = () => {
        if (batalkanProcessing) return;

        if (!presensi?.id) {
            toast.error("Tidak ada absen hari ini");
            return;
        }

        if (!confirm("Yakin ingin batalkan presensi hari ini?")) return;

        setBatalkanProcessing(true);

        router.delete(`/presensi/${presensi.id}`, {
            onSuccess: () => {
                toast.success("Presensi berhasil dibatalkan");
                setTimeout(() => window.location.reload(), 1000);
            },
            onError: () => {
                toast.error("Gagal membatalkan presensi");
                setBatalkanProcessing(false);
            },
        });
    };

    const ulangiFoto = () => {
        if (processing) return;
        bukaKamera(jenisAbsen);
    };

    return (
        <>
            <div className="space-y-4">
                {/* Info Jam & Lokasi - Full Width */}
                <div
                    className="rounded-2xl px-4 py-3 text-white"
                    style={{
                        background:
                            "linear-gradient(135deg, #2DD4BF 0%, #14B8A6 50%, #0D7377 100%)",
                        boxShadow: "0 4px 15px rgba(13,115,119,0.2)",
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p
                                className="text-xs"
                                style={{ color: "rgba(255,255,255,0.8)" }}
                            >
                                {new Date(
                                    today || Date.now(),
                                ).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                            <p className="text-lg font-bold">
                                {jam.toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })}
                            </p>
                        </div>
                        <button
                            onClick={getLokasi}
                            disabled={loadingLokasi}
                            className="px-4 py-2 rounded-full text-xs font-semibold text-white transition-all disabled:opacity-50"
                            style={{ background: "rgba(255,255,255,0.2)" }}
                        >
                            {loadingLokasi
                                ? "Mencari..."
                                : lokasi
                                  ? "Ambil Lokasi Ulang"
                                  : "Ambil Lokasi"}
                        </button>
                    </div>
                    <p
                        className="text-xs mt-1"
                        style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                        {lokasi
                            ? `Lokasi: ${lokasi.lat}, ${lokasi.long}`
                            : "Lokasi belum didapat"}
                    </p>
                </div>

                {/* Izin Hari Ini */}
                {izinHariIni && (
                    <div
                        className="rounded-2xl p-4 text-center"
                        style={{
                            background: "#FEF3C7",
                            border: "1px solid #F59E0B",
                        }}
                    >
                        <p
                            className="text-sm font-bold"
                            style={{ color: "#D97706" }}
                        >
                            Anda sudah {izinHariIni.jenis_izin} hari ini
                        </p>
                        <p
                            className="text-xs mt-1"
                            style={{ color: "#D97706" }}
                        >
                            {izinHariIni.hari}, {izinHariIni.tanggal_format}
                        </p>
                        <p
                            className="text-xs mt-1"
                            style={{ color: "#92400E" }}
                        >
                            {izinHariIni.keterangan}
                        </p>
                    </div>
                )}

                {/* Kamera Preview - Full Width */}
                {showKamera && !izinHariIni && (
                    <div
                        className="bg-white rounded-2xl p-4"
                        style={{
                            boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                        }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3
                                className="font-bold text-sm"
                                style={{ color: "#1F2937" }}
                            >
                                {jenisAbsen === "datang"
                                    ? "Absen Datang"
                                    : "Absen Pulang"}
                            </h3>
                            <button
                                onClick={switchKamera}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                                style={{
                                    background: "#F0FDFA",
                                    color: "#0D7377",
                                }}
                            >
                                Switch Kamera
                            </button>
                        </div>
                        <video
                            ref={videoRef}
                            className="w-full rounded-xl"
                            autoPlay
                            playsInline
                            muted
                            style={{
                                maxHeight: "400px",
                                background: "#000",
                                // Mirror preview kalau kamera depan, supaya user melihat
                                // dirinya sendiri seperti di cermin (sesuai kebiasaan)
                                // dan konsisten dengan hasil foto yang juga di-mirror.
                                transform:
                                    facingMode === "user"
                                        ? "scaleX(-1)"
                                        : "none",
                            }}
                        />
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={ambilFoto}
                                className="flex-1 py-2.5 rounded-full text-white font-semibold text-sm"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                }}
                            >
                                Ambil Foto
                            </button>
                            <button
                                onClick={tutupKamera}
                                className="px-4 py-2.5 rounded-full text-sm font-semibold"
                                style={{
                                    background: "#F0FDFA",
                                    color: "#0D7377",
                                }}
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}

                {/* Preview Foto - Full Width */}
                {previewFoto && !showKamera && !izinHariIni && (
                    <div
                        className="bg-white rounded-2xl p-4"
                        style={{
                            boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                        }}
                    >
                        <h3
                            className="font-bold text-sm mb-2"
                            style={{ color: "#1F2937" }}
                        >
                            Preview Foto{" "}
                            {jenisAbsen === "datang" ? "Datang" : "Pulang"}
                        </h3>
                        <img
                            src={previewFoto}
                            alt="Preview"
                            className="w-full rounded-xl mb-3"
                        />
                        <div className="space-y-1.5 mb-3">
                            <div className="flex justify-between items-center text-xs">
                                <span style={{ color: "#9CA3AF" }}>Waktu</span>
                                <span
                                    className="font-semibold"
                                    style={{ color: "#1F2937" }}
                                >
                                    {jam.toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span style={{ color: "#9CA3AF" }}>Lokasi</span>
                                <span
                                    className="font-semibold"
                                    style={{ color: "#1F2937" }}
                                >
                                    {lokasi
                                        ? `${lokasi.lat}, ${lokasi.long}`
                                        : "-"}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={submitAbsen}
                                disabled={processing}
                                className="flex-1 py-2.5 rounded-full text-white font-semibold text-sm disabled:opacity-50"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                    boxShadow:
                                        "0 4px 12px rgba(13,115,119,0.3)",
                                }}
                            >
                                {processing ? "Menyimpan..." : "Submit"}
                            </button>
                            <button
                                onClick={ulangiFoto}
                                disabled={processing}
                                className="flex-1 py-2.5 rounded-full text-sm font-semibold disabled:opacity-50"
                                style={{
                                    background: "#F0FDFA",
                                    color: "#0D7377",
                                }}
                            >
                                Ulangi
                            </button>
                        </div>
                    </div>
                )}

                {/* Card Absen - 2 Grid Desktop */}
                {!showKamera && !previewFoto && !izinHariIni && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Presensi Datang */}
                        <div
                            className="bg-white rounded-2xl p-4"
                            style={{
                                boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                            }}
                        >
                            <h3
                                className="font-bold text-sm mb-2"
                                style={{ color: "#1F2937" }}
                            >
                                Presensi Datang
                            </h3>
                            {fotoDatang ? (
                                <>
                                    <img
                                        src={fotoDatang}
                                        alt="Datang"
                                        className="w-full h-40 object-cover rounded-xl mb-2"
                                    />
                                    <div className="space-y-1 mb-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span style={{ color: "#9CA3AF" }}>
                                                Tanggal
                                            </span>
                                            <span
                                                className="font-semibold"
                                                style={{ color: "#1F2937" }}
                                            >
                                                {presensi?.hari
                                                    ? `${presensi.hari}, ${presensi.tanggal_format}`
                                                    : "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span style={{ color: "#9CA3AF" }}>
                                                Jam
                                            </span>
                                            <span
                                                className="font-semibold"
                                                style={{ color: "#1F2937" }}
                                            >
                                                {jamDatang || "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span style={{ color: "#9CA3AF" }}>
                                                Lokasi
                                            </span>
                                            <span
                                                className="font-semibold"
                                                style={{ color: "#1F2937" }}
                                            >
                                                {presensi?.lat_datang
                                                    ? `${presensi.lat_datang}, ${presensi.long_datang}`
                                                    : "-"}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => bukaKamera("datang")}
                                        className="w-full py-2 rounded-full text-xs font-semibold"
                                        style={{
                                            background: "#F0FDFA",
                                            color: "#0D7377",
                                        }}
                                    >
                                        Ambil Ulang
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => bukaKamera("datang")}
                                    className="w-full py-3 rounded-full text-white text-sm font-semibold"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                        boxShadow:
                                            "0 4px 12px rgba(13,115,119,0.3)",
                                    }}
                                >
                                    Absen Datang
                                </button>
                            )}
                        </div>

                        {/* Presensi Pulang */}
                        <div
                            className="bg-white rounded-2xl p-4"
                            style={{
                                boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                            }}
                        >
                            <h3
                                className="font-bold text-sm mb-2"
                                style={{ color: "#1F2937" }}
                            >
                                Presensi Pulang
                            </h3>
                            {fotoPulang ? (
                                <>
                                    <img
                                        src={fotoPulang}
                                        alt="Pulang"
                                        className="w-full h-40 object-cover rounded-xl mb-2"
                                    />
                                    <div className="space-y-1 mb-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span style={{ color: "#9CA3AF" }}>
                                                Tanggal
                                            </span>
                                            <span
                                                className="font-semibold"
                                                style={{ color: "#1F2937" }}
                                            >
                                                {presensi?.hari
                                                    ? `${presensi.hari}, ${presensi.tanggal_format}`
                                                    : "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span style={{ color: "#9CA3AF" }}>
                                                Jam
                                            </span>
                                            <span
                                                className="font-semibold"
                                                style={{ color: "#1F2937" }}
                                            >
                                                {jamPulang || "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span style={{ color: "#9CA3AF" }}>
                                                Lokasi
                                            </span>
                                            <span
                                                className="font-semibold"
                                                style={{ color: "#1F2937" }}
                                            >
                                                {presensi?.lat_pulang
                                                    ? `${presensi.lat_pulang}, ${presensi.long_pulang}`
                                                    : "-"}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => bukaKamera("pulang")}
                                        className="w-full py-2 rounded-full text-xs font-semibold"
                                        style={{
                                            background: "#F0FDFA",
                                            color: "#0D7377",
                                        }}
                                    >
                                        Ambil Ulang
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => bukaKamera("pulang")}
                                    className="w-full py-3 rounded-full text-white text-sm font-semibold"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                        boxShadow:
                                            "0 4px 12px rgba(13,115,119,0.3)",
                                    }}
                                >
                                    Absen Pulang
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Tombol Batalkan - Full Width */}
                {!showKamera &&
                    !previewFoto &&
                    !izinHariIni &&
                    presensi &&
                    (fotoDatang || fotoPulang) && (
                        <button
                            onClick={batalkanAbsen}
                            disabled={batalkanProcessing}
                            className="w-full py-2.5 rounded-full text-xs font-semibold text-red-600 disabled:opacity-50"
                            style={{ background: "#FEE2E2" }}
                        >
                            {batalkanProcessing
                                ? "Membatalkan..."
                                : "Batalkan Semua Presensi Hari Ini"}
                        </button>
                    )}

                {/* Riwayat Presensi - Full Width */}
                <div
                    className="bg-white rounded-2xl p-4"
                    style={{ boxShadow: "0 8px 20px rgba(13,115,119,0.08)" }}
                >
                    <h3
                        className="font-bold text-sm mb-3"
                        style={{ color: "#1F2937" }}
                    >
                        Riwayat Presensi
                    </h3>
                    {riwayat?.length === 0 || !riwayat ? (
                        <p
                            className="text-xs text-center py-4"
                            style={{ color: "#9CA3AF" }}
                        >
                            Belum ada riwayat presensi
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {riwayat.map((item, index) => (
                                <div
                                    key={index}
                                    className="py-2 border-b last:border-0"
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
                                            Datang
                                        </span>
                                        <span
                                            className="font-semibold"
                                            style={{ color: "#1F2937" }}
                                        >
                                            {item.jam_datang}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs mb-1">
                                        <span style={{ color: "#9CA3AF" }}>
                                            Pulang
                                        </span>
                                        <span
                                            className="font-semibold"
                                            style={{ color: "#1F2937" }}
                                        >
                                            {item.jam_pulang}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span style={{ color: "#9CA3AF" }}>
                                            Status
                                        </span>
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Presensi.layout = (page) => <AppLayout header="Presensi">{page}</AppLayout>;

export default Presensi;
