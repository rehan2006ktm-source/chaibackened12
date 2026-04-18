import { useEffect, useState } from "react";
import { likeApi } from "../services/api";
import { EmptyState } from "../components/ui/Feedback";

export default function LikedVideosPage() {
  const [liked, setLiked] = useState([]);
  useEffect(() => {
    likeApi.likedVideos().then((res) => setLiked(res?.data?.data || []));
  }, []);

  if (!liked.length) return <EmptyState title="No liked videos" description="Like a video and it will appear here." />;

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Liked videos</h1>
      {liked.map((item) => (
        <pre key={item._id} className="overflow-auto rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-gray-300">{JSON.stringify(item, null, 2)}</pre>
      ))}
    </div>
  );
}
