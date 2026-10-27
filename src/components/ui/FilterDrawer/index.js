import { datePresets, isEmptyFilter } from '@/lib/filters'
import clsx from 'clsx'
import { CalendarDays, ChevronDown, Search, Trash, Type, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Popover } from '../Popover'

const box = 'h-[50px] w-full rounded-lg border border-filter-line bg-white text-[15px] outline-none transition-colors'
const focusRing = 'focus:border-filter focus:ring-2 focus:ring-filter/20'

/**
 * SMSRadar-ın digər bölmələrindəki filtr paneli: sağdan açılır, dəyişikliklər yalnız "Tətbiq et" ilə tətbiq olunur.
 * Sahələrin konfiqurasiyası: lib/filters.js
 */
export function FilterDrawer({ fields, values, onApply, onClose }) {
  // Panel hər açılanda yenidən mount olunur — qaralama cari filtrlərdən başlayır
  const [draft, setDraft] = useState(values)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCloseRef.current()
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [])

  const setValue = (id, value) =>
    setDraft((d) => {
      const next = { ...d, [id]: value }
      // Asılı sahələr (məs. Marka → Model) ana sahə dəyişəndə təmizlənir
      fields.filter((f) => f.dependsOn === id).forEach((f) => delete next[f.id])
      return next
    })

  const apply = () => {
    onApply(Object.fromEntries(Object.entries(draft).filter(([, v]) => !isEmptyFilter(v))))
    onClose()
  }

  const clear = () => {
    onApply({})
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 animate-fade-in bg-[#1a1f29]/30" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filtrlər"
        className="absolute inset-y-0 right-0 flex w-[460px] max-w-full animate-slide-in-right flex-col bg-filter-bg shadow-[-8px_0_24px_rgba(16,24,40,0.12)]"
      >
        <div className="flex h-[68px] shrink-0 items-center justify-between bg-white px-5">
          <h2 className="text-xl font-medium text-ink">Filtrlər</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Bağla"
            className="rounded-md p-1 text-ink-2 transition-colors hover:bg-page"
          >
            <X size={26} strokeWidth={1.6} />
          </button>
        </div>

        <form
          id="filter-form"
          className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4"
          onSubmit={(e) => {
            e.preventDefault()
            apply()
          }}
        >
          {fields.map((field) => (
            <FilterField key={field.id} field={field} draft={draft} onChange={(v) => setValue(field.id, v)} />
          ))}
        </form>

        <div className="grid shrink-0 grid-cols-2 gap-6 px-5 py-4">
          <button
            type="submit"
            form="filter-form"
            className="flex h-12 items-center justify-center gap-2.5 rounded-lg bg-filter text-base font-medium text-white transition-colors hover:bg-[#3873a8]"
          >
            <Search size={20} />
            Tətbiq et
          </button>
          <button
            type="button"
            onClick={clear}
            className="flex h-12 items-center justify-center gap-2.5 rounded-lg border border-filter-line bg-white text-base font-medium text-ink transition-colors hover:bg-[#f8fafb]"
          >
            <Trash size={18} />
            Təmizlə
          </button>
        </div>
      </aside>
    </div>,
    document.body,
  )
}

function FilterField({ field, draft, onChange }) {
  const value = draft[field.id]
  const Wrapper = field.type === 'select' ? 'label' : 'div'
  return (
    <Wrapper className="flex flex-col gap-2">
      <span className="text-[15px] text-filter-label">{field.label}</span>
      {field.type === 'select' && <FilterSelect field={field} draft={draft} value={value} onChange={onChange} />}
      {field.type === 'dateRange' && <DateRange label={field.label} value={value ?? {}} onChange={onChange} />}
      {field.type === 'numberRange' && <NumberRange field={field} value={value ?? {}} onChange={onChange} />}
    </Wrapper>
  )
}

function FilterSelect({ field, draft, value = '', onChange }) {
  const parentEmpty = field.dependsOn && isEmptyFilter(draft[field.dependsOn])
  const options = typeof field.options === 'function' ? field.options(draft) : field.options
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={parentEmpty}
        className={clsx(
          box,
          focusRing,
          'appearance-none pl-4 pr-11 disabled:cursor-not-allowed disabled:bg-[#f7f9fb]',
          value ? 'text-ink' : 'text-[#a8b2bf]',
        )}
      >
        <option value="">{parentEmpty ? field.dependsOnHint ?? field.label : field.label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-ink">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={20}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-filter-icon"
      />
    </div>
  )
}

/** Boş olanda placeholder göstərən tarix sahəsi (native date input placeholder dəstəkləmir) */
function DateInput({ value, onChange, placeholder, min, max, inputRef }) {
  const [focused, setFocused] = useState(false)
  const showDate = focused || !!value
  return (
    <input
      ref={inputRef}
      type={showDate ? 'date' : 'text'}
      value={value ?? ''}
      min={min}
      max={max}
      placeholder={placeholder}
      aria-label={placeholder}
      onFocus={(e) => {
        setFocused(true)
        const el = e.target
        // type "date"-ə keçdikdən sonra təqvimi aç
        requestAnimationFrame(() => {
          try {
            el.showPicker?.()
          } catch {
            // bəzi brauzerlərdə showPicker yalnız klikdə icazəlidir
          }
        })
      }}
      onBlur={() => setFocused(false)}
      onChange={(e) => onChange(e.target.value)}
      className="date-plain h-full w-full min-w-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-[#a8b2bf]"
    />
  )
}

function DateRange({ label, value, onChange }) {
  const fromRef = useRef(null)
  const toRef = useRef(null)
  const set = (patch) => onChange({ ...value, ...patch })

  return (
    <div className={clsx(box, 'flex items-center focus-within:border-filter focus-within:ring-2 focus-within:ring-filter/20')}>
      <Popover
        align="left"
        trigger={({ toggle }) => (
          <button
            type="button"
            onClick={toggle}
            title="Hazır aralıqlar"
            aria-label={`${label}: hazır aralıqlar`}
            className="flex h-[48px] w-12 shrink-0 items-center justify-center rounded-l-lg border-r border-filter-line text-filter transition-colors hover:bg-filter-bg"
          >
            <Type size={22} strokeWidth={1.8} />
          </button>
        )}
      >
        {(close) => (
          <div className="flex flex-col">
            {datePresets().map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  onChange(p.value)
                  close()
                }}
                className="rounded-md px-3 py-2 text-left text-sm text-ink hover:bg-filter-bg"
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </Popover>
      <div className="flex h-full min-w-0 flex-1 items-center gap-3 px-3">
        <DateInput
          inputRef={fromRef}
          value={value.from}
          max={value.to || undefined}
          placeholder="Başlama tarixi"
          onChange={(from) => set({ from })}
        />
        <span className="shrink-0 text-[#a8b2bf]">→</span>
        <DateInput
          inputRef={toRef}
          value={value.to}
          min={value.from || undefined}
          placeholder="Bitmə tarixi"
          onChange={(to) => set({ to })}
        />
      </div>
      <button
        type="button"
        aria-label="Təqvimi aç"
        onClick={() => (value.from ? toRef : fromRef).current?.focus()}
        className="mr-3 shrink-0 rounded p-1 text-[#a8b2bf] transition-colors hover:text-filter"
      >
        <CalendarDays size={18} />
      </button>
    </div>
  )
}

function NumberRange({ field, value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch })
  const input = (key, placeholder) => (
    <input
      type="number"
      min="0"
      step={field.step ?? 'any'}
      inputMode="decimal"
      value={value[key] ?? ''}
      placeholder={placeholder}
      aria-label={`${field.label}: ${placeholder}`}
      onChange={(e) => set({ [key]: e.target.value })}
      className={clsx(box, focusRing, 'px-4 text-ink placeholder:text-[#a8b2bf]')}
    />
  )
  return (
    <div className="flex items-center gap-3">
      {input('min', field.minPlaceholder ?? 'Minimum')}
      <span className="shrink-0 text-[#a8b2bf]">—</span>
      {input('max', field.maxPlaceholder ?? 'Maksimum')}
    </div>
  )
}
