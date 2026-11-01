export default function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-graphite/10 bg-mist p-5">
      <p className="font-mono text-xs uppercase tracking-wideish text-char/50">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-char">{value}</p>
      {sub && <p className="mt-1 font-mono text-xs text-char/50">{sub}</p>}
    </div>
  );
}
