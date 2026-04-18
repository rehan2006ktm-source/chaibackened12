import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Heart, Trash2 } from "lucide-react";
import { likeApi, tweetApi } from "../services/api";
import { useAuthStore } from "../store/authStore";

const Tweets = () => {
    const [tweets, setTweets] = useState([]);
    const [newTweet, setNewTweet] = useState("");
    const [loading, setLoading] = useState(true);
    const user = useAuthStore((s) => s.user);

    const fetchTweets = async () => {
        if (!user?._id) return;
        try {
            const response = await tweetApi.byUser(user._id);
            setTweets(response?.data?.data || []);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to fetch tweets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTweets(); }, [user?._id]);

    const createTweet = async (e) => {
        e.preventDefault();
        if (!newTweet.trim()) return;
        try {
            await tweetApi.create({ content: newTweet });
            setNewTweet("");
            fetchTweets();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to post tweet");
        }
    };

    const deleteTweet = async (tweetId) => {
        try {
            await tweetApi.remove(tweetId);
            setTweets((prev) => prev.filter((t) => t._id !== tweetId));
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete tweet");
        }
    };

    if (loading) return <div className="p-8 space-y-6">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4 border p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-20 bg-muted rounded w-full" />
                </div>
            </div>
        ))}
    </div>

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold px-4">Community</h1>
            <form onSubmit={createTweet} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <textarea
                    value={newTweet}
                    onChange={(e) => setNewTweet(e.target.value)}
                    className="h-24 w-full rounded-xl border border-white/15 bg-transparent p-2 text-sm outline-none"
                    placeholder="Share an update..."
                />
                <button className="mt-3 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold">Post</button>
            </form>

            <div className="space-y-4">
                {tweets.length > 0 ? (
                    tweets.map((tweet) => (
                        <div key={tweet._id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="p-1 flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-secondary flex-shrink-0 overflow-hidden">
                                    <img src={user?.avatar || "https://placehold.co/100x100/111827/e5e7eb?text=U"} alt="" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm">{user?.fullname || "You"}</span>
                                            <span className="text-muted-foreground text-xs">@{user?.username}</span>
                                        </div>
                                        <button className="p-1 hover:bg-muted rounded-full" onClick={() => deleteTweet(tweet._id)}>
                                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                    <p className="text-[15px] leading-normal">{tweet.content}</p>
                                    <div className="flex items-center justify-between pt-2 max-w-sm">
                                        <button className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors" onClick={() => likeApi.toggleTweet(tweet._id)}>
                                            <Heart className="w-4 h-4" />
                                            <span className="text-xs">Like</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 border rounded-xl border-dashed">
                        No community posts yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tweets;
