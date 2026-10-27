import clsx from 'clsx'

/**
 * dot — məhsul statusları (solda nöqtə)
 * strong — çatdırılma statusları (SemiBold 11.5px, radius 20)
 */
export function StatusPill({ status, dot, strong, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 whitespace-nowrap',
        strong ? 'rounded-[20px] px-[9px] py-[5px] text-[11.5px] font-semibold' : 'rounded-xl text-[11px] font-medium',
        !strong && (dot ? 'px-2 py-1' : 'px-2.5 py-[5px]'),
        className,
      )}
      style={{ backgroundColor: status.bg, color: status.fg }}
    >
      {dot && <span className="size-2 rounded-full" style={{ backgroundColor: 'currentColor' }} />}
      {status.label}
    </span>
  )
}
