import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authApi } from "../services/api";
import { EmptyState } from "../components/ui/Feedback";

export default function ChannelPage() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    authApi.getChannelByUsername(username).then((res) => setChannel(res?.data?.data || null));
  }, [username]);

  if (!channel) return <EmptyState title="Loading channel..." description="Fetching profile details." />;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <img src={channel.coverImage || "https://placehold.co/1200x320/111827/e5e7eb?text=Channel"} alt="cover" className="h-44 w-full rounded-xl object-cover" />
      <div className="-mt-8 flex items-end gap-4 px-4">
        <img src={channel.avatar} alt={channel.username} className="h-20 w-20 rounded-full border-4 border-[#030712] object-cover" />
        <div>
          <h1 className="text-2xl font-bold">{channel.fullname}</h1>
          <p className="text-sm text-gray-400">@{channel.username}</p>
        </div>
      </div>
    </div>
  );
}
