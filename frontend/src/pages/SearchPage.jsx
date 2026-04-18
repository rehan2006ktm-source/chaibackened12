import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { videoApi } from "../services/api";
import { VideoCard } from "../components/video/VideoCard";

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    videoApi.getFeed().then((res) => setVideos(res?.data?.data || []));
  }, []);

  const filtered = useMemo(
    () => videos.filter((v) => `${v.title} ${v.description}`.toLowerCase().includes(query.toLowerCase())),
    [videos, query]
  );

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Search results for "{query}"</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}
