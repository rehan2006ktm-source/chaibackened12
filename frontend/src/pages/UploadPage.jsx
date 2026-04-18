import { useState } from "react";
import toast from "react-hot-toast";
import { videoApi } from "../services/api";

export default function UploadPage() {
  const [form, setForm] = useState({ title: "", description: "", videoFile: null, thumbnail: null });

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
    try {
      await videoApi.upload(fd);
      toast.success("Video uploaded");
      setForm({ title: "", description: "", videoFile: null, thumbnail: null });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h1 className="text-xl font-bold">Upload Video</h1>
      <input required placeholder="Title" className="w-full rounded-xl border border-white/15 bg-transparent p-2" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
      <textarea required placeholder="Description" className="h-32 w-full rounded-xl border border-white/15 bg-transparent p-2" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
      <input required type="file" accept="video/*" onChange={(e) => setForm((p) => ({ ...p, videoFile: e.target.files?.[0] || null }))} />
      <input required type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, thumbnail: e.target.files?.[0] || null }))} />
      <button className="rounded-lg bg-indigo-500 px-4 py-2">Publish</button>
    </form>
  );
}
