import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function RegisterPage() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
    setLoading(true);
    try {
      await register(fd);
      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        {["fullname", "username", "email", "password"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            className="w-full rounded-xl border border-white/15 bg-transparent p-2 text-white"
            placeholder={field}
            onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          />
        ))}
        <input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.files?.[0] || null }))} className="w-full text-sm text-gray-300" />
        <button disabled={loading} className="w-full rounded-xl bg-indigo-500 py-2 font-semibold text-white disabled:opacity-60">{loading ? "Creating..." : "Create account"}</button>
        <p className="text-sm text-gray-400">Already registered? <Link to="/login" className="text-indigo-300">Login</Link></p>
      </form>
    </div>
  );
}
