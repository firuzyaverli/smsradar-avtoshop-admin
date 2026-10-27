import clsx from 'clsx'
import checkIcon from '@/assets/icons/check.svg'

export function Checkbox({ checked, onChange, size = 20, disabled, label, ariaLabel, indeterminate }) {
  return (
    <label className={clsx('inline-flex items-center gap-2.5', disabled ? 'cursor-default' : 'cursor-pointer')}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        aria-label={label ? undefined : ariaLabel}
        ref={(el) => {
          if (el) el.indeterminate = !!indeterminate && !checked
        }}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span
        className={clsx(
          'relative inline-flex shrink-0 items-center justify-center rounded-[5px] transition-colors',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 peer-focus-visible:ring-offset-1',
          checked || indeterminate ? (disabled ? 'bg-[#8cadc7]' : 'bg-checkbox') : 'bg-page',
        )}
        style={{ width: size, height: size }}
      >
        {checked && <img src={checkIcon} alt="" width={size} height={size} className="absolute inset-0" />}
        {!checked && indeterminate && <span className="h-0.5 w-2.5 rounded bg-white" />}
      </span>
      {label && <span className={clsx('text-sm font-medium', disabled ? 'text-[#808791]' : 'text-ink-2')}>{label}</span>}
    </label>
  )
}
