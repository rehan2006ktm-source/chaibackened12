import { Search, UserCircle2, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export function Topbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060b16]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link to="/" className="text-xl font-bold tracking-tight text-white">
          Tube<span className="text-indigo-400">Nova</span>
        </Link>
        <div className="ml-auto hidden w-full max-w-lg items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 md:flex">
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search videos..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/search?q=${encodeURIComponent(e.currentTarget.value)}`);
            }}
          />
        </div>
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/channel/${user?.username || ""}`)}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-gray-200"
            >
              {user?.fullname || "Profile"}
            </button>
            <button
              onClick={onLogout}
              className="rounded-lg border border-white/15 px-2 py-1.5 text-gray-300"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Sign in
          </button>
        )}
        {!isAuthenticated && <UserCircle2 className="text-gray-500" size={22} />}
      </div>
    </header>
  );
}
