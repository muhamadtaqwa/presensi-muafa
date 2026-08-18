import React, { useState, useRef, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AppLayout from "./Layouts/AppLayout";
import toast from "react-hot-toast";

function Presensi({ presensi, today }) {
    const [jam, setJam] = useState(new Date());
    const [lokasi, setLokasi] = useState(null);
    const [jenisAbsen, setJenisAbsen] = useState(null);
    const [fotoDatang, setFotoDatang] = useState(null);
    const [fotoPulang, setFotoPulang] = useState(null);
    const [jamDatang, setJamDatang] = useState(null);
    const [jamPulang, setJamPulang] = useState(null);
    const [showKamera, setShowKamera] = useState(false);
    const [previewFoto, setPreviewFoto] = useState(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const { post, processing } = useForm();

    useEffect(() => {
        const interval = setInterval(() => setJam(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (presensi) {
            if (presensi.foto_datang)
                setFotoDatang(`/storage/${presensi.foto_datang}`);
            if (presensi.foto_pulang)
                setFotoPulang(`/storage/${presensi.foto_pulang}`);
            if (presensi.jam_datang) setJamDatang(presensi.jam_datang);
            if (presensi.jam_pulang) setJamPulang(presensi.jam_pulang);
        }
    }, [presensi]);

    const getLokasi = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLokasi({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                    });
                    toast.success("Lokasi berhasil didapat");
                },
                () => {
                    toast.error("Gagal mendapatkan lokasi");
                },
                { enableHighAccuracy: true, timeout: 10000 },
            );
        } else {
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
                video: { facingMode: "environment" },
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

    const tutupKamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setShowKamera(false);
        setJenisAbsen(null);
    };

    const ambilFoto = () => {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const koordinat = lokasi
            ? `${lokasi.lat}, ${lokasi.long}`
            : "Lokasi tidak tersedia";
        const waktu = jam.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(10, canvas.height - 80, canvas.width - 20, 70);
        ctx.fillStyle = "#fff";
        ctx.fillText(`Lokasi: ${koordinat}`, 20, canvas.height - 45);
        ctx.fillText(`Jam: ${waktu}`, 20, canvas.height - 15);

        setPreviewFoto(canvas.toDataURL("image/jpeg"));
        tutupKamera();
    };

    const submitAbsen = () => {
        if (!previewFoto) {
            toast.error("Foto wajib diambil");
            return;
        }

        if (!lokasi) {
            toast.error("Lokasi wajib didapatkan");
            return;
        }

        const formData = new FormData();
        formData.append("tanggal", today);
        formData.append("status", "normal");

        if (jenisAbsen === "datang") {
            formData.append("jam_datang", jam.toTimeString().slice(0, 8));
            formData.append("lat_datang", lokasi.lat.toString());
            formData.append("long_datang", lokasi.long.toString());
        } else {
            formData.append("jam_pulang", jam.toTimeString().slice(0, 8));
            formData.append("lat_pulang", lokasi.lat.toString());
            formData.append("long_pulang", lokasi.long.toString());
        }

        fetch(previewFoto)
            .then((res) => res.blob())
            .then((blob) => {
                if (jenisAbsen === "datang") {
                    formData.append("foto_datang", blob, "datang.jpg");
                } else {
                    formData.append("foto_pulang", blob, "pulang.jpg");
                }

                post("/presensi", {
                    data: formData,
                    forceFormData: true,
                    onSuccess: () => {
                        toast.success(`Absen ${jenisAbsen} berhasil disimpan`);
                        if (jenisAbsen === "datang") {
                            setFotoDatang(previewFoto);
                            setJamDatang(jam.toTimeString().slice(0, 8));
                        } else {
                            setFotoPulang(previewFoto);
                            setJamPulang(jam.toTimeString().slice(0, 8));
                        }
                        setPreviewFoto(null);
                        setJenisAbsen(null);
                    },
                    onError: () => {
                        toast.error("Gagal menyimpan absen");
                    },
                });
            });
    };

    const ulangiFoto = () => {
        bukaKamera(jenisAbsen);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Info Jam & Lokasi */}
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
                        {new Date(today || Date.now()).toLocaleDateString(
                            "id-ID",
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            },
                        )}
                    </p>
                    <h2 className="text-3xl font-bold mt-1">
                        {jam.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })}
                    </h2>
                    <p
                        className="text-sm mt-2"
                        style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                        {lokasi
                            ? `Lokasi: ${lokasi.lat}, ${lokasi.long}`
                            : "Lokasi belum didapat"}
                    </p>
                    <button
                        onClick={getLokasi}
                        className="mt-4 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
                        style={{ background: "rgba(255,255,255,0.2)" }}
                    >
                        Ambil Lokasi
                    </button>
                </div>

                {/* Kamera Preview */}
                {showKamera && (
                    <div
                        className="bg-white rounded-2xl p-5"
                        style={{
                            boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                        }}
                    >
                        <h3
                            className="font-bold mb-3"
                            style={{ color: "#1F2937" }}
                        >
                            {jenisAbsen === "datang"
                                ? "Absen Datang"
                                : "Absen Pulang"}
                        </h3>
                        <video
                            ref={videoRef}
                            className="w-full rounded-xl"
                            autoPlay
                            playsInline
                            style={{ maxHeight: "400px", background: "#000" }}
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={ambilFoto}
                                className="flex-1 py-3 rounded-full text-white font-semibold text-sm"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                }}
                            >
                                Ambil Foto
                            </button>
                            <button
                                onClick={tutupKamera}
                                className="px-6 py-3 rounded-full text-sm font-semibold"
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

                {/* Preview Foto + Tombol Submit/Ulangi */}
                {previewFoto && !showKamera && (
                    <div
                        className="bg-white rounded-2xl p-5"
                        style={{
                            boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                        }}
                    >
                        <h3
                            className="font-bold mb-3"
                            style={{ color: "#1F2937" }}
                        >
                            Preview Foto{" "}
                            {jenisAbsen === "datang" ? "Datang" : "Pulang"}
                        </h3>
                        <img
                            src={previewFoto}
                            alt="Preview"
                            className="w-full rounded-xl mb-4"
                        />
                        <div className="space-y-2 mb-4">
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
                        <div className="flex gap-3">
                            <button
                                onClick={submitAbsen}
                                disabled={processing}
                                className="flex-1 py-3 rounded-full text-white font-semibold text-sm disabled:opacity-50"
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
                                className="flex-1 py-3 rounded-full text-sm font-semibold"
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

                {/* Tombol Absen Atas Bawah */}
                {!showKamera && !previewFoto && (
                    <div className="space-y-4">
                        {/* Absen Datang */}
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
                                Absen Datang
                            </h3>
                            {fotoDatang ? (
                                <>
                                    <img
                                        src={fotoDatang}
                                        alt="Datang"
                                        className="w-full h-40 object-cover rounded-xl mb-3"
                                    />
                                    <div className="space-y-1.5 mb-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span style={{ color: "#9CA3AF" }}>
                                                Waktu
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
                                                {lokasi
                                                    ? `${lokasi.lat}, ${lokasi.long}`
                                                    : "-"}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => bukaKamera("datang")}
                                        className="w-full py-2.5 rounded-full text-xs font-semibold"
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
                                    className="w-full py-3.5 rounded-full text-white text-sm font-semibold"
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

                        {/* Absen Pulang */}
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
                                Absen Pulang
                            </h3>
                            {fotoPulang ? (
                                <>
                                    <img
                                        src={fotoPulang}
                                        alt="Pulang"
                                        className="w-full h-40 object-cover rounded-xl mb-3"
                                    />
                                    <div className="space-y-1.5 mb-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span style={{ color: "#9CA3AF" }}>
                                                Waktu
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
                                                {lokasi
                                                    ? `${lokasi.lat}, ${lokasi.long}`
                                                    : "-"}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => bukaKamera("pulang")}
                                        className="w-full py-2.5 rounded-full text-xs font-semibold"
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
                                    className="w-full py-3.5 rounded-full text-white text-sm font-semibold"
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
            </div>
        </>
    );
}

Presensi.layout = (page) => <AppLayout header="Presensi">{page}</AppLayout>;

export default Presensi;
