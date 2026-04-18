import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Video,
    Users,
    Settings,
    Home,
    ThumbsUp,
    History,
    MessageSquare,
    Flame,
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, href, active, onClick }) => (
    <Link
        to={href}
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group",
            active
                ? "bg-primary/10 text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
    >
        <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", active && "scale-110")} />
        <span className="text-sm">{label}</span>
    </Link>
);

const Sidebar = ({ mobile = false, onClose }) => {
    const location = useLocation();
    const { status } = useSelector((state) => state.auth);

    const publicItems = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Flame, label: "Trending", href: "/?sort=trending" },
    ];

    const protectedItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Video, label: "My Content", href: "/content" },
        { icon: Users, label: "Subscribers", href: "/subscribers" },
        { icon: ThumbsUp, label: "Liked Videos", href: "/liked" },
        { icon: History, label: "History", href: "/history" },
        { icon: MessageSquare, label: "Tweets", href: "/tweets" },
    ];

    const bottomItems = [
        { icon: Settings, label: "Settings", href: "/settings" },
    ];

    const handleClick = () => {
        if (mobile && onClose) onClose();
    };

    const isActive = (href) => {
        if (href === "/") return location.pathname === "/";
        return location.pathname.startsWith(href.split("?")[0]) && href !== "/";
    };

    const sidebarClass = mobile
        ? "flex flex-col h-full p-4 gap-6 overflow-y-auto"
        : "hidden md:flex flex-col w-64 border-r bg-card p-4 gap-6 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto";

    return (
        <aside className={sidebarClass}>
            {/* Main nav */}
            <div className="flex flex-col gap-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
                    Browse
                </p>
                {publicItems.map((item) => (
                    <SidebarItem
                        key={item.href}
                        {...item}
                        active={isActive(item.href)}
                        onClick={handleClick}
                    />
                ))}

                {status && (
                    <>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 mt-4 mb-1">
                            Your Channel
                        </p>
                        {protectedItems.map((item) => (
                            <SidebarItem
                                key={item.href}
                                {...item}
                                active={isActive(item.href)}
                                onClick={handleClick}
                            />
                        ))}
                    </>
                )}
            </div>

            {/* Bottom */}
            <div className="mt-auto border-t border-border/50 pt-4 flex flex-col gap-1">
                {bottomItems.map((item) => (
                    <SidebarItem
                        key={item.href}
                        {...item}
                        active={isActive(item.href)}
                        onClick={handleClick}
                    />
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
