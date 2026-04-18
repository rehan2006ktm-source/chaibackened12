import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { commentApi, likeApi, subscriptionApi, videoApi } from "../services/api";
import { EmptyState } from "../components/ui/Feedback";

export default function WatchPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [editingCommentId, setEditingCommentId] = useState("");
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const [videoRes, commentsRes] = await Promise.all([videoApi.getById(videoId), commentApi.list(videoId)]);
        setVideo(videoRes?.data?.data || null);
        setComments(commentsRes?.data?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Could not load video.");
      }
    };
    run();
  }, [videoId]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await commentApi.add(videoId, { content });
      const { data } = await commentApi.list(videoId);
      setComments(data?.data || []);
      setContent("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not add comment");
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await commentApi.remove(commentId);
      const { data } = await commentApi.list(videoId);
      setComments(data?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not delete comment");
    }
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingContent(comment.content);
  };

  const saveEdit = async () => {
    try {
      await commentApi.update(editingCommentId, { newContent: editingContent });
      const { data } = await commentApi.list(videoId);
      setComments(data?.data || []);
      setEditingCommentId("");
      setEditingContent("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update comment");
    }
  };

  if (error) return <EmptyState title="Watch page failed" description={error} />;
  if (!video) return <div className="text-gray-400">Loading video...</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-4">
        <video src={video.videoFile} controls className="aspect-video w-full rounded-2xl border border-white/10 bg-black" />
        <h1 className="text-2xl font-semibold">{video.title}</h1>
        <p className="text-sm text-gray-300">{video.description}</p>
        <div className="flex gap-2">
          <button onClick={() => likeApi.toggleVideo(videoId)} className="rounded-xl border border-white/15 px-4 py-2 text-sm">Like</button>
          <button onClick={() => subscriptionApi.toggle(video.owner?._id || video.owner)} className="rounded-xl border border-white/15 px-4 py-2 text-sm">Subscribe</button>
        </div>
      </section>
      <aside className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="font-semibold">Comments</h2>
        <form onSubmit={addComment} className="space-y-2">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="h-24 w-full rounded-xl border border-white/15 bg-transparent p-2 text-sm outline-none" placeholder="Write a comment..." />
          <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold">Post comment</button>
        </form>
        <div className="space-y-2">
          {comments.map((c) => (
            <div key={c._id} className="rounded-lg border border-white/10 p-2 text-sm">
              <p className="font-medium text-gray-200">{c.owner?.username}</p>
              {editingCommentId === c._id ? (
                <div className="space-y-2">
                  <textarea value={editingContent} onChange={(e) => setEditingContent(e.target.value)} className="h-20 w-full rounded-lg border border-white/15 bg-transparent p-2 text-xs" />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="rounded-md border border-white/15 px-2 py-1 text-xs">Save</button>
                    <button onClick={() => setEditingCommentId("")} className="rounded-md border border-white/15 px-2 py-1 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">{c.content}</p>
              )}
              <div className="mt-2 flex gap-2">
                <button onClick={() => likeApi.toggleComment(c._id)} className="rounded-md border border-white/15 px-2 py-1 text-xs">Like</button>
                <button onClick={() => startEdit(c)} className="rounded-md border border-white/15 px-2 py-1 text-xs">Edit</button>
                <button onClick={() => deleteComment(c._id)} className="rounded-md border border-white/15 px-2 py-1 text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
