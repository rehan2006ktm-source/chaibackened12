import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back!");
      navigate(location.state?.from || "/feed", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h1 className="text-2xl font-bold text-white">Login</h1>
        <input className="w-full rounded-xl border border-white/15 bg-transparent p-2 text-white" placeholder="Email (optional)" onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <input className="w-full rounded-xl border border-white/15 bg-transparent p-2 text-white" placeholder="Username (optional)" onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} />
        <input type="password" className="w-full rounded-xl border border-white/15 bg-transparent p-2 text-white" placeholder="Password" required onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
        <button disabled={loading} className="w-full rounded-xl bg-indigo-500 py-2 font-semibold text-white disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button>
        <p className="text-sm text-gray-400">No account? <Link to="/register" className="text-indigo-300">Register</Link></p>
      </form>
    </div>
  );
}
