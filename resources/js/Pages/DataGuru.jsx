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
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h2
                        className="text-2xl font-bold"
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
                    <div className="space-y-3">
                        {guru.map((g) => (
                            <div
                                key={g.id}
                                className="bg-white rounded-2xl p-5"
                                style={{
                                    boxShadow:
                                        "0 8px 20px rgba(13,115,119,0.08)",
                                }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, #2DD4BF, #0D7377)",
                                                }}
                                            >
                                                {g.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p
                                                    className="font-semibold text-sm truncate"
                                                    style={{ color: "#1F2937" }}
                                                >
                                                    {g.name}
                                                </p>
                                                <p
                                                    className="text-xs truncate"
                                                    style={{ color: "#9CA3AF" }}
                                                >
                                                    {g.jabatan ||
                                                        "Tanpa Jabatan"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 space-y-1.5">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span
                                                    style={{ color: "#9CA3AF" }}
                                                >
                                                    NIP:
                                                </span>
                                                <span
                                                    className="font-medium"
                                                    style={{ color: "#1F2937" }}
                                                >
                                                    {g.nip || "-"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span
                                                    style={{ color: "#9CA3AF" }}
                                                >
                                                    Username:
                                                </span>
                                                <span
                                                    className="font-medium"
                                                    style={{ color: "#1F2937" }}
                                                >
                                                    {g.username}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => openEdit(g)}
                                            className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
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
                                            className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                                            style={{
                                                background: "#FEE2E2",
                                                color: "#DC2626",
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    </div>
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label
                                        className="block text-xs font-semibold mb-1.5"
                                        style={{ color: "#1F2937" }}
                                    >
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) =>
                                            setData("username", e.target.value)
                                        }
                                        className="w-full px-4 py-3 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                        placeholder="Masukkan username"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-xs font-semibold mb-1.5"
                                        style={{ color: "#1F2937" }}
                                    >
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full px-4 py-3 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-xs font-semibold mb-1.5"
                                        style={{ color: "#1F2937" }}
                                    >
                                        Password{" "}
                                        {editMode &&
                                            "(kosongkan jika tidak diubah)"}
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full px-4 py-3 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                        placeholder="Masukkan password"
                                        required={!editMode}
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-xs font-semibold mb-1.5"
                                        style={{ color: "#1F2937" }}
                                    >
                                        NIP
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nip}
                                        onChange={(e) =>
                                            setData("nip", e.target.value)
                                        }
                                        className="w-full px-4 py-3 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                        placeholder="Masukkan NIP"
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-xs font-semibold mb-1.5"
                                        style={{ color: "#1F2937" }}
                                    >
                                        Jabatan
                                    </label>
                                    <input
                                        type="text"
                                        value={data.jabatan}
                                        onChange={(e) =>
                                            setData("jabatan", e.target.value)
                                        }
                                        className="w-full px-4 py-3 border-2 border-teal-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors text-sm bg-teal-50/30"
                                        placeholder="Masukkan jabatan"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-3 rounded-full text-white font-semibold text-sm transition-all disabled:opacity-50"
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
                                        className="px-6 py-3 rounded-full text-sm font-semibold transition-all"
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
