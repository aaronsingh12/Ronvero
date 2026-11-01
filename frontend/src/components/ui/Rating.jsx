import { StarIcon } from './Icons.jsx';
import { cn } from '../../utils/cn.js';

export default function Rating({ value = 0, count, size = 14, className = '' }) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="relative flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} size={size} filled={false} className="text-graphite/20" />
        ))}
        <div
          className="absolute inset-0 flex overflow-hidden"
          style={{ width: `${Math.max(0, Math.min(5, value)) * 20}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} size={size} filled className="text-ember shrink-0" />
          ))}
        </div>
      </div>
      {count !== undefined && <span className="font-mono text-xs text-char/60">({count})</span>}
    </div>
  );
}
