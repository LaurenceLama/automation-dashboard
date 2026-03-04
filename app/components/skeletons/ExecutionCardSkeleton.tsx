export default function ExecutionCardSkeleton() {
  return (
    <div className="animate-pulse border rounded-xl p-4 max-w-xs space-y-3">
      <div className="h-4 bg-gray-400 rounded w-1/3" />
      <div className="h-3 bg-gray-400 rounded w-1/2" />
      <div className="h-3 bg-gray-400 rounded w-2/3" />
      <div className="h-8 bg-gray-400 rounded w-full mt-4" />
    </div>
  );
}