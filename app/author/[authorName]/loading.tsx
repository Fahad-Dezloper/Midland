export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Author Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid Skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded mb-6 w-48 animate-pulse"></div>
        <div className="grid 
          gap-4
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-5
          xl:grid-cols-6
        ">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[3/4] bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
