import { useEffect, useState } from "react";
import { VideoCard } from "../components/video/VideoCard";
import { EmptyState, SkeletonGrid } from "../components/ui/Feedback";
import { videoApi } from "../services/api";

export default function HomeFeedPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await videoApi.getFeed();
        setVideos(data?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to fetch videos.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <SkeletonGrid />;
  if (error) return <EmptyState title="Feed unavailable" description={error} />;
  if (!videos.length) {
    return <EmptyState title="No videos yet" description="Upload your first video from the upload section." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}
