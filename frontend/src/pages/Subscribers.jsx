import { useEffect, useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import { authApi, subscriptionApi } from "../services/api";
import { useAuthStore } from "../store/authStore";

const Subscribers = () => {
    const user = useAuthStore((s) => s.user);
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const channelUser = user?._id ? user : (await authApi.getCurrentUser())?.data?.data;
                if (!channelUser?._id) {
                    setError("Could not resolve current user.");
                    return;
                }
                const response = await subscriptionApi.getSubscribers(channelUser._id);
                setSubscribers(response?.data?.data?.subscription || []);
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to fetch subscribers");
            } finally {
                setLoading(false);
            }
        };
        fetchSubscribers();
    }, [user]);

    if (loading) return <div className="p-8 space-y-6 animate-pulse">
        <div className="h-10 bg-muted rounded-lg w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-xl" />)}
        </div>
    </div>

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">Subscribers</h1>
                    <p className="text-muted-foreground">{subscribers.length} people are following your channel</p>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-red-300">{error}</div>
            ) : subscribers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {subscribers.map((sub) => (
                        <div key={sub._id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all group">
                            <div className="flex items-center gap-4">
                                <img src={sub.subscriber?.avatar || "https://placehold.co/100x100/111827/e5e7eb?text=U"} alt={sub.subscriber?.username} className="h-12 w-12 rounded-full object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{sub.subscriber?.fullname}</p>
                                    <p className="text-xs text-muted-foreground truncate">@{sub.subscriber?.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <UsersIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold">No subscribers yet</h3>
                    <p className="text-muted-foreground italic">Share your videos to get more audience!</p>
                </div>
            )}
        </div>
    );
};

export default Subscribers;
