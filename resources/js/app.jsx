import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";
import "../css/app.css";

createInertiaApp({
    title: (title) => `${title} - Presensi Muafa`,
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: "#0D7377",
                            color: "#fff",
                        },
                        success: {
                            duration: 4000,
                            style: {
                                background: "#059669",
                                color: "#fff",
                            },
                        },
                        error: {
                            duration: 4000,
                            style: {
                                background: "#dc2626",
                                color: "#fff",
                            },
                        },
                    }}
                />
            </>,
        );
    },
    progress: {
        color: "#0D7377",
    },
});
