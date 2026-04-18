import { useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../services/api";

export default function SettingsPage() {
  const [account, setAccount] = useState({ fullname: "", email: "" });
  const [passwords, setPasswords] = useState({ oldpassword: "", newpassword: "" });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const updateAccount = async (e) => {
    e.preventDefault();
    try {
      await authApi.updateAccount(account);
      toast.success("Account updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await authApi.changePassword(passwords);
      toast.success("Password changed");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };

  const uploadAvatar = async (e) => {
    e.preventDefault();
    if (!avatar) return;
    try {
      const fd = new FormData();
      fd.append("avatar", avatar);
      await authApi.updateAvatar(fd);
      toast.success("Avatar updated");
      setAvatar(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Avatar update failed");
    }
  };

  const uploadCoverImage = async (e) => {
    e.preventDefault();
    if (!coverImage) return;
    try {
      const fd = new FormData();
      fd.append("coverImage", coverImage);
      await authApi.updateCoverImage(fd);
      toast.success("Cover image updated");
      setCoverImage(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cover image update failed");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form onSubmit={updateAccount} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-lg font-semibold">Profile Settings</h2>
        <input placeholder="Full name" className="w-full rounded-xl border border-white/15 bg-transparent p-2" onChange={(e) => setAccount((p) => ({ ...p, fullname: e.target.value }))} />
        <input placeholder="Email" className="w-full rounded-xl border border-white/15 bg-transparent p-2" onChange={(e) => setAccount((p) => ({ ...p, email: e.target.value }))} />
        <button className="rounded-lg bg-indigo-500 px-4 py-2">Save account</button>
      </form>
      <form onSubmit={changePassword} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-lg font-semibold">Security</h2>
        <input type="password" placeholder="Old password" className="w-full rounded-xl border border-white/15 bg-transparent p-2" onChange={(e) => setPasswords((p) => ({ ...p, oldpassword: e.target.value }))} />
        <input type="password" placeholder="New password" className="w-full rounded-xl border border-white/15 bg-transparent p-2" onChange={(e) => setPasswords((p) => ({ ...p, newpassword: e.target.value }))} />
        <button className="rounded-lg bg-indigo-500 px-4 py-2">Update password</button>
      </form>
      <form onSubmit={uploadAvatar} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-lg font-semibold">Avatar</h2>
        <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
        <button className="rounded-lg bg-indigo-500 px-4 py-2">Upload avatar</button>
      </form>
      <form onSubmit={uploadCoverImage} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-lg font-semibold">Cover Image</h2>
        <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
        <button className="rounded-lg bg-indigo-500 px-4 py-2">Upload cover image</button>
      </form>
    </div>
  );
}
