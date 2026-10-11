// Shows which engine produced a chat reply, so it's obvious when the backup is answering.
export function MessageSourceBadge({ source }: { source?: string }) {
  if (!source || source === 'system') return null;

  let label = source;
  let className = 'border-zinc-700 text-zinc-400';
  if (source.startsWith('gemini-')) {
    className = 'border-emerald-700/60 bg-emerald-950/40 text-emerald-300';
  } else if (source === 'deterministic-energy-engine') {
    label = 'backup: deterministic-energy-engine';
    className = 'border-amber-700/60 bg-amber-950/40 text-amber-300';
  } else if (source === 'network-error') {
    label = 'offline: backend unreachable';
    className = 'border-red-700/60 bg-red-950/40 text-red-300';
  }

  return (
    <span className={`px-1.5 py-0.5 rounded border font-mono text-[9px] leading-none ${className}`} title={`Source: ${source}`}>
      {label}
    </span>
  );
}
