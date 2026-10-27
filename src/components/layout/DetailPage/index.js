import clsx from 'clsx'
import { useNavigate } from 'react-router'

/**
 * Əlavə et / redaktə / baxış ekranlarının şablonu:
 * yuxarıda "← Geri" və mərkəzdə başlıq, altda tablar, ən altda sabit düymələr paneli.
 */
export function DetailPage({ title, backTo, tabs, footer, children }) {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-[calc(100dvh-90px)] flex-col gap-3.5">
      <div className="relative flex min-h-12 items-center justify-center">
        <button
          type="button"
          onClick={() => navigate(backTo)}
          className="absolute left-0 flex h-9 w-[92px] items-center justify-center rounded-[7px] border border-[#e3e8f0] bg-white text-xs font-medium text-ink hover:bg-[#f8fafb]"
        >
          ← Geri
        </button>
        <h1 className="line-clamp-2 px-[104px] text-center text-lg font-semibold text-ink sm:text-xl">{title}</h1>
      </div>
      {tabs}
      <div className="flex-1">{children}</div>
      {footer && (
        <div
          className={clsx(
            'sticky bottom-0 z-10 -mx-4 flex h-16 items-center justify-center gap-4 border-t border-[#e3e8f0] bg-white px-4',
            'lg:mx-0',
          )}
        >
          {footer}
        </div>
      )}
    </div>
  )
}

export function PageTitle({ children, actions }) {
  return (
    <div className="flex min-h-12 flex-wrap items-center justify-between gap-3">
      <h1 className="text-[22px] font-bold text-heading">{children}</h1>
      {actions}
    </div>
  )
}
