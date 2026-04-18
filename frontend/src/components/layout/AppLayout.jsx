import { Home, Upload, LayoutDashboard, Heart, History, Settings, Users, Clapperboard, MessageSquare } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Topbar } from "./Topbar";

const items = [
  { to: "/feed", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/liked", label: "Liked", icon: Heart },
  { to: "/subscriptions", label: "Subscriptions", icon: Users },
  { to: "/subscribers", label: "Subscribers", icon: Users },
  { to: "/content", label: "Content", icon: Clapperboard },
  { to: "/tweets", label: "Tweets", icon: MessageSquare },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-[#030712] text-gray-100">
      <Topbar />
      <div className="mx-auto flex w-full max-w-7xl">
        <aside className="sticky top-[61px] hidden h-[calc(100vh-61px)] w-60 border-r border-white/10 p-4 md:block">
          <nav className="space-y-1">
            {items.map(({ to, label, icon: Icon }) => {
              const active = location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    active ? "bg-indigo-500/15 text-indigo-300" : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-h-[calc(100vh-61px)] flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
