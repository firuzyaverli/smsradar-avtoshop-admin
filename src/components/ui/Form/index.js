import clsx from 'clsx'
import { forwardRef } from 'react'
import { Checkbox } from '../Checkbox'

// Baxış rejimində (disabled) sahələr: boz fon, nazik border, solğun mətn — Figma "Görünüş" ekranları
const control =
  'w-full rounded-[7px] border border-transparent bg-field px-3 text-xs text-ink outline-none transition-shadow placeholder:text-placeholder focus:ring-2 focus:ring-brand/30 disabled:border-[#e5e8ed] disabled:bg-[#f1f2f5] disabled:text-[#616b7a] disabled:opacity-[.82] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-danger/40'

/** Label (Medium 12px) + sahə, aralarında 6px */
export function Field({ label, error, children, className, as: Tag = 'label' }) {
  return (
    <Tag className={clsx('flex min-w-0 flex-col gap-1.5', className)}>
      <span className="text-xs font-medium text-ink">{label}</span>
      {children}
      {error && <span className="text-[11px] text-danger-text">{error}</span>}
    </Tag>
  )
}

/** "Status" + "Aktivdir" checkbox-u */
export function StatusField({ checked, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-medium text-[#575e6b]">Status</span>
      <div className="flex h-[42px] items-center">
        <Checkbox size={24} checked={checked} onChange={onChange} disabled={disabled} label="Aktivdir" />
      </div>
    </div>
  )
}

export const Input = forwardRef(function Input({ className, placeholder = 'Daxil edin', ...props }, ref) {
  return <input ref={ref} placeholder={placeholder} className={clsx(control, 'h-[42px]', className)} {...props} />
})

export const Select = forwardRef(function Select({ className, placeholder = 'Seçin', options, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={clsx(control, 'peer h-[42px] appearance-none pr-8 invalid:text-placeholder', className)}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-medium text-ink peer-disabled:opacity-35">
        ⌄
      </span>
    </div>
  )
})

export const Textarea = forwardRef(function Textarea({ className, placeholder = 'Daxil edin', ...props }, ref) {
  return (
    <textarea
      ref={ref}
      placeholder={placeholder}
      className={clsx(control, 'min-h-[88px] resize-y py-3', className)}
      {...props}
    />
  )
})

/** Formun ağ kartı: padding 16, sətirlər arası 14, sütunlar arası 12 */
export function FormCard({ children, className }) {
  return <div className={clsx('flex flex-col gap-3.5 rounded-[9px] bg-white p-4', className)}>{children}</div>
}

export function FormGrid({ children, cols = 2 }) {
  return (
    <div
      className={clsx(
        'grid grid-cols-1 gap-x-3 gap-y-3.5',
        cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-4',
      )}
    >
      {children}
    </div>
  )
}
