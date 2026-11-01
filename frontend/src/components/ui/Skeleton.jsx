import { cn } from '../../utils/cn.js';

export function SkeletonBox({ className = '' }) {
  return <div className={cn('skeleton rounded-xl', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <SkeletonBox className="aspect-[4/5] w-full" />
      <SkeletonBox className="h-4 w-3/4" />
      <SkeletonBox className="h-4 w-1/3" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox key={i} className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}
