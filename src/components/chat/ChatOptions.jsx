import { cn } from '../../lib/cn.js';

export default function ChatOptions({ options, onSelect, disabled }) {
  if (!options?.length) return null;
  return (
    <div className="flex flex-col gap-2 pl-12 sm:flex-row sm:flex-wrap">
      {options.map((o, i) => (
        <button
          key={`${o.n}-${i}`}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(o.l, o.n)}
          className={cn(
            'rounded-lg border px-4 py-2.5 text-left text-sm font-semibold transition-colors',
            'outline-none focus-visible:ring-2 focus-visible:ring-[rgba(16,177,50,0.12)] focus-visible:ring-offset-2',
            i === 0
              ? 'border-[var(--color-gray-900)] bg-[var(--color-gray-900)] text-white hover:bg-[var(--color-gray-800)]'
              : 'border-[var(--color-gray-300)] bg-white text-[var(--color-gray-600)] hover:border-[var(--color-gray-400)]',
            disabled && 'pointer-events-none opacity-50',
          )}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}
