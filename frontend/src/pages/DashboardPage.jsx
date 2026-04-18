import { useEffect, useState } from "react";
import { dashboardApi } from "../services/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  useEffect(() => {
    dashboardApi.stats().then((res) => setStats(res?.data?.data || {}));
  }, []);

  const cards = [
    ["Videos", stats.totalVideos || 0],
    ["Views", stats.totalviews || 0],
    ["Likes", stats.totallikes || 0],
    ["Subscribers", stats.totalSubscriber || 0],
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
