export function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="aspect-video bg-white/10" />
          <div className="space-y-2 p-3">
            <div className="h-4 w-4/5 rounded bg-white/10" />
            <div className="h-3 w-2/5 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
