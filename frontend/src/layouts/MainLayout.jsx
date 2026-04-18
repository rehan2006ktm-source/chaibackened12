import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar onMenuClick={() => setMobileOpen((v) => !v)} />

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Mobile Sidebar Overlay */}
                {mobileOpen && (
                    <div
                        className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                )}

                {/* Mobile Sidebar Drawer */}
                <div
                    className={`md:hidden fixed left-0 top-16 bottom-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ${
                        mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <Sidebar mobile onClose={() => setMobileOpen(false)} />
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
