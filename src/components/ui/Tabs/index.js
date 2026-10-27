import clsx from 'clsx'

/** compact — modal içindəki tablar (120px en, sol boşluq 16px) */
export function Tabs({ tabs, active, onChange, compact }) {
  return (
    <div
      role="tablist"
      className={clsx('flex h-[58px] shrink-0 overflow-x-auto border-b border-[#e3e8f0] bg-white', compact ? 'pl-4' : 'pl-6')}
    >
      {tabs.map((t) => {
        const selected = t.key === active
        return (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(t.key)}
            className={clsx(
              'flex shrink-0 flex-col items-center justify-center text-sm font-medium transition-colors',
              compact ? 'w-[120px]' : 'w-[130px]',
              selected ? 'text-brand' : clsx(compact ? 'text-[#6b7380]' : 'text-ink', 'hover:text-brand'),
            )}
          >
            {t.label}
            <span className={clsx('h-0.5 w-full', selected ? 'bg-brand' : 'bg-transparent')} />
          </button>
        )
      })}
    </div>
  )
}
