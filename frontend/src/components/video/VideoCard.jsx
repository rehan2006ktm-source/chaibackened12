import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export function VideoCard({ video }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <Link to={`/watch/${video?._id}`}>
        <img
          src={video?.thumbnail || "https://placehold.co/600x340/111827/e5e7eb?text=No+Thumbnail"}
          alt={video?.title || "video"}
          className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-100">{video?.title || "Untitled video"}</h3>
        <p className="text-xs text-gray-400">{video?.owner?.fullname || "Unknown creator"}</p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Eye size={13} />
          {video?.views || 0} views
        </div>
      </div>
    </motion.div>
  );
}
