import { cn } from '../../utils/cn.js';

const styles = {
  sale: 'bg-ember text-chalk',
  new: 'bg-trace text-chalk',
  bestseller: 'bg-graphite text-chalk',
  outOfStock: 'bg-mist text-char/60 border border-char/15',
  low: 'bg-chalk text-ember border border-ember/40',
};

export default function Badge({ type = 'new', children, className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wideish',
        styles[type],
        className
      )}
    >
      {children}
    </span>
  );
}
