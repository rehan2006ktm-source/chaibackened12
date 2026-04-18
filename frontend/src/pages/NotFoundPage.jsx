import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] px-4 text-center">
      <div>
        <h1 className="text-5xl font-bold text-white">404</h1>
        <p className="mt-2 text-gray-400">This page does not exist.</p>
        <Link to="/feed" className="mt-5 inline-block rounded-xl bg-indigo-500 px-5 py-2 text-white">Back to feed</Link>
      </div>
    </div>
  );
}
