import { useEffect, useState } from "react";
import { authApi } from "../services/api";
import { VideoCard } from "../components/video/VideoCard";
import { EmptyState } from "../components/ui/Feedback";

export default function HistoryPage() {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    authApi.getHistory().then((res) => setVideos(res?.data?.data || []));
  }, []);

  if (!videos.length) return <EmptyState title="No watch history" description="Your recently watched videos will show here." />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}
