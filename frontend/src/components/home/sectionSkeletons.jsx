import { SkeletonBox } from '../ui/Skeleton.jsx';

export function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonBox key={i} className="aspect-[3/4]" />
      ))}
    </div>
  );
}

export function BannerSkeleton({ className = 'h-[420px]' }) {
  return <SkeletonBox className={`w-full ${className}`} />;
}
