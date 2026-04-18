import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl text-5xl font-bold leading-tight">
          Ship your channel like a premium startup product.
        </motion.h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-300">
          A sleek video platform with clean UX, responsive layouts, and full API-powered flows.
        </p>
        <div className="mt-10 flex gap-3">
          <Link to="/feed" className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold">Explore Feed</Link>
          <Link to="/register" className="rounded-xl border border-white/20 px-6 py-3">Create account</Link>
        </div>
      </section>
    </div>
  );
}
