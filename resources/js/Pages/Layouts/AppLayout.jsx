import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Camera,
    Calendar,
    Users,
    Settings,
    FileText,
} from "lucide-react";

export default function AppLayout({ children, header }) {
    const { auth } = usePage().props;
    const user = auth?.user;

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
                  {
                      name: "Izin",
                      href: "/izin",
                      icon: FileText,
                      key: "izin",
                  },
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
            className="min-h-screen pb-24"
            style={{
                background: "#F0FDFA",
                fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
        >
            {/* Main Content */}
            <main className="px-4 py-5 max-w-4xl mx-auto">{children}</main>

            {/* Bottom Navigation */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-30"
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
                            // Tombol Presensi Tengah (Mencolok)
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
