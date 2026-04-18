import { useEffect, useState } from "react";
import { subscriptionApi } from "../services/api";
import { EmptyState } from "../components/ui/Feedback";

export default function SubscriptionsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    subscriptionApi
      .listMine()
      .then((res) => setItems(res?.data?.data || res?.data?.subscription || []))
      .catch((e) => setError(e?.response?.data?.message || "Unable to fetch subscriptions"));
  }, []);

  if (error) return <EmptyState title="Subscriptions unavailable" description={error} />;
  if (!items.length) return <EmptyState title="No subscriptions yet" description="Subscribe to channels from watch pages." />;

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Subscriptions</h1>
      {items.map((entry, i) => (
        <div key={entry?._id || i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          {entry?.channelDetails?.username || entry?.subscriber?.username || "Channel"}
        </div>
      ))}
    </div>
  );
}
