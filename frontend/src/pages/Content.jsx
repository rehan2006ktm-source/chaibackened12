import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";
import { dashboardApi, videoApi } from "../services/api";

const Content = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVideos = async () => {
        try {
            const response = await dashboardApi.videos();
            setVideos(response?.data?.data || []);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to fetch videos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleDelete = async (videoId) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;
        try {
            await videoApi.remove(videoId);
            setVideos(videos.filter(v => v._id !== videoId));
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete video");
        }
    };

    const togglePublish = async (videoId) => {
        try {
            await videoApi.togglePublish(videoId);
            fetchVideos();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to toggle publish");
        }
    };

    if (loading) return <div className="p-8 space-y-6 animate-pulse">
        <div className="h-10 bg-muted rounded-lg w-1/4" />
        <div className="h-64 bg-muted rounded-xl" />
    </div>

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">Your Content</h1>
                    <p className="text-sm text-muted-foreground">Manage and track your video performance.</p>
                </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] shadow-sm overflow-hidden">
                <div className="overflow-x-auto rounded-xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/50 border-b">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Video</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Views</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {videos.length > 0 ? (
                                videos.map((video) => (
                                    <tr key={video._id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="p-4">
                                            {video.isPublished ? (
                                                <div className="flex items-center text-green-500 gap-1 text-xs font-bold">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Published
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-muted-foreground gap-1 text-xs font-bold">
                                                    <XCircle className="w-3.5 h-3.5" /> Private
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm line-clamp-1">{video.title}</p>
                                                    <p className="text-[11px] text-muted-foreground line-clamp-1">{video.description.substring(0, 50)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                                            {new Date(video.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm font-medium hidden md:table-cell">
                                            {video.views.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button className="h-8 rounded-md border border-white/15 px-2 text-xs" onClick={() => togglePublish(video._id)}>
                                                    {video.isPublished ? "Unpublish" : "Publish"}
                                                </button>
                                                <button className="h-8 w-8 hover:text-destructive" onClick={() => handleDelete(video._id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-muted-foreground italic">
                                        No videos uploaded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Content;
