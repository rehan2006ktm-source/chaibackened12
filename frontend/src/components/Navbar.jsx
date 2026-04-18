import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";
import api from "@/services/api";
import {
    Search,
    Bell,
    Menu,
    LogOut,
    User,
    Moon,
    Sun,
    Settings,
    LayoutDashboard,
    X,
} from "lucide-react";

const Navbar = ({ onMenuClick }) => {
    const { status, userData } = useSelector((state) => state.auth);
    const { theme, setTheme } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/users/logout");
        } catch { /* ignore */ }
        dispatch(logout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setProfileOpen(false);
        navigate("/login");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="h-16 border-b bg-card/95 backdrop-blur-sm px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            {/* Left: Logo + Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <Link to="/" className="flex items-center gap-2 text-primary">
                    <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-black">V</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter hidden sm:block">VideoTube</span>
                </Link>
            </div>

            {/* Center: Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search videos..."
                        className="w-full bg-secondary/80 border border-border/50 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all"
                    />
                </div>
            </form>

            {/* Right: Theme + Auth */}
            <div className="flex items-center gap-1 md:gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                    aria-label="Toggle theme"
                >
                    <Sun className="w-5 h-5 hidden dark:block text-yellow-500" />
                    <Moon className="w-5 h-5 dark:hidden text-slate-600" />
                </button>

                {status ? (
                    <div className="flex items-center gap-2">
                        {/* Notification bell */}
                        <button className="p-2 hover:bg-secondary rounded-full relative transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
                        </button>

                        {/* Profile dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileOpen((v) => !v)}
                                className="flex items-center gap-2 pl-2 border-l border-border ml-1 hover:opacity-80 transition-opacity"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold overflow-hidden shadow ring-2 ring-primary/20">
                                    {userData?.avatar ? (
                                        <img src={userData.avatar} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-4 h-4" />
                                    )}
                                </div>
                                <span className="hidden lg:block text-sm font-semibold max-w-[120px] truncate">
                                    {userData?.fullname}
                                </span>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-4 py-3 border-b border-border/50">
                                        <p className="text-sm font-bold truncate">{userData?.fullname}</p>
                                        <p className="text-xs text-muted-foreground truncate">{userData?.email}</p>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/settings"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors"
                                    >
                                        <Settings className="w-4 h-4 text-muted-foreground" />
                                        Settings
                                    </Link>
                                    <div className="border-t border-border/50 mt-1 pt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 ml-1">
                        <Link
                            to="/login"
                            className="text-sm font-medium px-3 py-1.5 hover:bg-secondary rounded-lg transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="text-sm font-bold px-4 py-1.5 bg-primary text-primary-foreground hover:opacity-90 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
