import { motion } from 'framer-motion';

/** data: [{ label, value }] */
export default function SimpleBarChart({ data, height = 180, formatValue = (v) => v }) {
  if (!data || data.length === 0) {
    return <p className="font-body text-sm text-char/50">Not enough data yet.</p>;
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        {data.map((d, i) => {
          const barHeight = (d.value / max) * (height - 24);
          return (
            <g key={d.label}>
              <motion.rect
                x={i * barWidth + barWidth * 0.15}
                width={barWidth * 0.7}
                y={height - 24 - barHeight}
                initial={{ height: 0 }}
                animate={{ height: barHeight }}
                transition={{ duration: 0.6, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                rx={2}
                fill="#FF4A2E"
              />
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-char/40">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
      <p className="mt-1 font-mono text-xs text-char/50">Peak: {formatValue(max)}</p>
    </div>
  );
}
