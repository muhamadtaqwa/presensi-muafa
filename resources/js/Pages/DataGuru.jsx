import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import AppLayout from "./Layouts/AppLayout";

function DataGuru({ guru }) {
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const { data, setData, post, put, reset, processing } = useForm({
        username: "",
        name: "",
        password: "",
        nip: "",
        jabatan: "",
    });

    const openTambah = () => {
        setEditMode(false);
        reset();
        setShowModal(true);
    };

    const openEdit = (g) => {
        setEditMode(true);
        setEditId(g.id);
        setData({
            username: g.username,
            name: g.name,
            password: "",
            nip: g.nip || "",
            jabatan: g.jabatan || "",
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            put(`/data-guru/${editId}`, {
                onSuccess: () => {
                    toast.success("Data guru berhasil diupdate");
                    setShowModal(false);
                    reset();
                },
                onError: () => {
                    toast.error("Gagal update data guru");
                },
            });
        } else {
            post("/data-guru", {
                onSuccess: () => {
                    toast.success("Guru berhasil ditambahkan");
                    setShowModal(false);
                    reset();
                },
                onError: () => {
                    toast.error("Gagal menambahkan guru");
                },
            });
        }
    };

    const handleDelete = (id, name) => {
        if (confirm(`Yakin ingin menghapus ${name}?`)) {
            const form = useForm();
            form.delete(`/data-guru/${id}`, {
                onSuccess: () => {
                    toast.success("Guru berhasil dihapus");
                },
                onError: () => {
                    toast.error("Gagal menghapus guru");
                },
            });
        }
    };

    return (
        <>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h2
                        className="text-lg font-bold"
                        style={{ color: "#1F2937" }}
                    >
                        Data Guru
                    </h2>
                    <button
                        onClick={openTambah}
                        className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
                        style={{
                            background:
                                "linear-gradient(135deg, #2DD4BF, #0D7377)",
                            boxShadow: "0 4px 12px rgba(13,115,119,0.3)",
                        }}
                    >
                        + Tambah Guru
                    </button>
                </div>

                {/* Export buttons */}
                <div className="flex gap-2">
                    <a
                        href="/data-guru/export-excel"
                        className="flex-1 text-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                        style={{
                            background: "#FFFFFF",
                            color: "#0D7377",
                            boxShadow: "0 4px 12px rgba(13,115,119,0.08)",
                        }}
                    >
                        Export Excel
                    </a>
                    <a
                        href="/data-guru/export-pdf"
                        className="flex-1 text-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                        style={{
                            background: "#FFFFFF",
                            color: "#0D7377",
                            boxShadow: "0 4px 12px rgba(13,115,119,0.08)",
                        }}
                    >
                        Export PDF
                    </a>
                </div>

                {/* Card List Guru */}
                {guru.length === 0 ? (
                    <div
                        className="bg-white rounded-2xl p-8 text-center text-sm"
                        style={{
                            color: "#9CA3AF",
                            boxShadow: "0 8px 20px rgba(13,115,119,0.08)",
                        }}
                    >
                        Belum ada data guru
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {guru.map((g) => (
                            <div
                                key={g.id}
                                className="bg-white rounded-2xl p-5"
                                style={{
                                    boxShadow:
                                        "0 8px 20px rgba(13,115,119,0.08)",
                                }}
                            >
                                {/* Info Guru - Kanan Kiri */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span style={{ color: "#9CA3AF" }}>
                                            Nama
                                        </span>
                                        <span
                                            className="font-semibold text-sm"
                                            style={{ color: "#1F2937" }}
                                        >
                                            {g.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span style={{ color: "#9CA3AF" }}>
                                            Username
                                        </span>
                                        <span
                                            className="font-semibold"
                                            style={{ color: "#1F2937" }}
                                        >
                                            {g.username}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span style={{ color: "#9CA3AF" }}>
                                            NIP
                                        </span>
                                        <span
                                            className="font-semibold"
                                            style={{ color: "#1F2937" }}
                                        >
                                            {g.nip || "-"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span style={{ color: "#9CA3AF" }}>
                                            Jabatan
                                        </span>
                                        <span
                                            className="font-semibold"
                                            style={{ color: "#1F2937" }}
                                        >
                                            {g.jabatan || "-"}
                                        </span>
                                    </div>
                                </div>

                                {/* Aksi */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => openEdit(g)}
                                        className="py-2 rounded-full text-xs font-semibold transition-all"
                                        style={{
                                            background: "#F0FDFA",
                                            color: "#0D7377",
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(g.id, g.name)
                                        }
                                        className="py-2 rounded-full text-xs font-semibold transition-all"
                                        style={{
                                            background: "#FEE2E2",
                                            color: "#DC2626",
                                        }}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal Tambah/Edit */}
                {showModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
                            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3
                                className="font-bold text-lg mb-4"
                                style={{ color: "#1F2937" }}
                            >
                                {editMode ? "Edit Guru" : "Tambah Guru"}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <label
                                        className="text-xs w-28 flex-shrink-0"
                                        style={{ color: "#9CA3AF" }}
                                    >
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) =>
                                            setData("username", e.target.value)
                                        }
                                        className="flex-1 px-3 py-2 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <label
                                        className="text-xs w-28 flex-shrink-0"
                                        style={{ color: "#9CA3AF" }}
                                    >
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="flex-1 px-3 py-2 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <label
                                        className="text-xs w-28 flex-shrink-0"
                                        style={{ color: "#9CA3AF" }}
                                    >
                                        Password {editMode && "(kosongkan)"}
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="flex-1 px-3 py-2 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                        required={!editMode}
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <label
                                        className="text-xs w-28 flex-shrink-0"
                                        style={{ color: "#9CA3AF" }}
                                    >
                                        NIP
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nip}
                                        onChange={(e) =>
                                            setData("nip", e.target.value)
                                        }
                                        className="flex-1 px-3 py-2 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <label
                                        className="text-xs w-28 flex-shrink-0"
                                        style={{ color: "#9CA3AF" }}
                                    >
                                        Jabatan
                                    </label>
                                    <input
                                        type="text"
                                        value={data.jabatan}
                                        onChange={(e) =>
                                            setData("jabatan", e.target.value)
                                        }
                                        className="flex-1 px-3 py-2 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 rounded-full text-white font-semibold text-sm transition-all disabled:opacity-50"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                            boxShadow:
                                                "0 4px 12px rgba(13,115,119,0.3)",
                                        }}
                                    >
                                        {processing ? "Menyimpan..." : "Simpan"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                                        style={{
                                            background: "#F0FDFA",
                                            color: "#0D7377",
                                        }}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

DataGuru.layout = (page) => <AppLayout header="Data Guru">{page}</AppLayout>;

export default DataGuru;
