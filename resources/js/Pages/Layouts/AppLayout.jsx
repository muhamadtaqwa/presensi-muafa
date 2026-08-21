import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Camera,
    Calendar,
    Users,
    Settings,
    FileText,
    Menu,
    LogOut,
} from "lucide-react";

export default function AppLayout({ children, header }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [collapsed, setCollapsed] = useState(false);

    const menuItems =
        user?.role === "admin"
            ? [
                  {
                      name: "Dashboard",
                      href: "/dashboard",
                      icon: LayoutDashboard,
                      key: "dashboard",
                  },
                  {
                      name: "Rekap",
                      href: "/rekap",
                      icon: Calendar,
                      key: "rekap",
                  },
                  {
                      name: "Presensi",
                      href: "/presensi",
                      icon: Camera,
                      key: "presensi",
                      center: true,
                  },
                  {
                      name: "Data Guru",
                      href: "/data-guru",
                      icon: Users,
                      key: "data-guru",
                  },
                  {
                      name: "Setting",
                      href: "/setting",
                      icon: Settings,
                      key: "setting",
                  },
              ]
            : [
                  {
                      name: "Dashboard",
                      href: "/dashboard",
                      icon: LayoutDashboard,
                      key: "dashboard",
                  },
                  { name: "Izin", href: "/izin", icon: FileText, key: "izin" },
                  {
                      name: "Presensi",
                      href: "/presensi",
                      icon: Camera,
                      key: "presensi",
                      center: true,
                  },
                  {
                      name: "Rekap",
                      href: "/rekap",
                      icon: Calendar,
                      key: "rekap",
                  },
                  {
                      name: "Setting",
                      href: "/setting",
                      icon: Settings,
                      key: "setting",
                  },
              ];

    return (
        <div
            className="min-h-screen pb-24 lg:pb-0"
            style={{
                background: "#F0FDFA",
                fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
        >
            {/* Sidebar Desktop */}
            <aside
                className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 ${
                    collapsed ? "w-20" : "w-64"
                }`}
                style={{
                    background:
                        "linear-gradient(180deg, #0D7377 0%, #14B8A6 100%)",
                    boxShadow: "4px 0 20px rgba(13,115,119,0.15)",
                }}
            >
                {/* Hamburger Toggle + Judul */}
                <div
                    className={`flex items-center px-4 h-16 border-b border-white/10 ${collapsed ? "justify-center" : "gap-3"}`}
                >
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center hover:bg-white/25 transition-all flex-shrink-0"
                    >
                        <Menu size={20} color="#fff" />
                    </button>
                    {!collapsed && (
                        <span className="text-white font-bold text-sm text-left">
                            Presensi Muafa
                        </span>
                    )}
                </div>

                {/* Menu */}
                <nav className="mt-4 px-3 space-y-1 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = window.location.pathname === item.href;

                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                                    active
                                        ? "bg-white/15 text-white font-semibold"
                                        : "text-white/60 hover:bg-white/5 hover:text-white"
                                } ${collapsed ? "justify-center" : ""}`}
                                title={collapsed ? item.name : ""}
                            >
                                <Icon size={20} />
                                {!collapsed && (
                                    <span className="text-sm text-left">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User & Logout */}
                <div className="p-3 border-t border-white/10">
                    <div
                        className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""} mb-2`}
                    >
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                                {user?.name?.charAt(0) || "M"}
                            </span>
                        </div>
                        {!collapsed && (
                            <div className="min-w-0 text-left">
                                <p className="text-white text-xs font-semibold truncate">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-white/50 text-[10px] truncate capitalize">
                                    {user?.role}
                                </p>
                            </div>
                        )}
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-semibold ${
                            collapsed ? "justify-center" : ""
                        }`}
                        title={collapsed ? "Logout" : ""}
                    >
                        <LogOut size={18} />
                        {!collapsed && (
                            <span className="text-left">Logout</span>
                        )}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-64"}`}
            >
                <main className="px-4 py-5 lg:px-8 w-full">{children}</main>
            </div>

            {/* Bottom Navigation Mobile */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-30 lg:hidden"
                style={{
                    background: "#FFFFFF",
                    borderTop: "1px solid #CCFBF1",
                    boxShadow: "0 -4px 20px rgba(13,115,119,0.08)",
                    paddingBottom: "env(safe-area-inset-bottom)",
                }}
            >
                <div className="flex items-end justify-around px-2 pt-2 pb-3 max-w-4xl mx-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = window.location.pathname === item.href;

                        if (item.center) {
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className="flex flex-col items-center gap-1 relative -mt-6"
                                >
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #2DD4BF 0%, #14B8A6 50%, #0D7377 100%)",
                                            boxShadow:
                                                "0 8px 25px rgba(13,115,119,0.45)",
                                            border: "4px solid #FFFFFF",
                                        }}
                                    >
                                        <Icon size={24} />
                                    </div>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className="flex flex-col items-center gap-1 px-2 py-1"
                            >
                                <Icon
                                    size={20}
                                    style={{
                                        color: active ? "#0D7377" : "#D1D5DB",
                                    }}
                                />
                                <span
                                    className="text-[10px] font-semibold"
                                    style={{
                                        color: active ? "#0D7377" : "#9CA3AF",
                                    }}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
