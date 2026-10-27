import statCancelled from '@/assets/icons/stat-cancelled.svg'
import statDelivery from '@/assets/icons/stat-delivery.svg'
import statOrders from '@/assets/icons/stat-orders.svg'
import statProducts from '@/assets/icons/stat-products.svg'
import statSales from '@/assets/icons/stat-sales.svg'
import { getDashboardStats, getMonthlyStats } from '@/data/dashboard'
import { formatDayMonth, formatNumber } from '@/lib/format'
import { Popover } from '@/components/ui'
import clsx from 'clsx'
import { Check, ChevronDown } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

const SERIES = [
  { key: 'orders', label: 'Sifariş sayı', color: '#8561f2' },
  { key: 'sales', label: 'Satış məbləği', color: '#baa8f7' },
  { key: 'delivering', label: 'Çatdırılmada', color: '#0a8f73' },
]

const STATUS_LEGEND = [
  { key: 'completed', label: 'Tamamlandı', color: '#4f87f7' },
  { key: 'new', label: 'Yeni', color: '#f5a624' },
  { key: 'preparing', label: 'Hazırlanır', color: '#8c5cdb' },
  { key: 'delivering', label: 'Çatdırılmada', color: '#0a8f73' },
  { key: 'cancelled', label: 'Ləğv edildi', color: '#d94a4a' },
]

const card = 'rounded-xl border border-line-soft bg-white shadow-[0_4px_7px_rgba(0,0,0,0.06)]'

const controlBox =
  'h-[38px] rounded-lg border border-[#dbe0e5] bg-white text-sm font-medium text-heading outline-none'

export function DashboardPage() {
  const [period, setPeriod] = useState('week')
  const [offset, setOffset] = useState(0)
  const [method, setMethod] = useState('all')

  const stats = useMemo(
    () =>
      period === 'week'
        ? getDashboardStats({ weekOffset: offset, method })
        : getMonthlyStats({ monthOffset: offset, method }),
    [period, offset, method],
  )

  const kpis = [
    { icon: statOrders, bg: '#edf5ff', value: formatNumber(stats.totals.orders), label: 'Ümumi sifariş sayı' },
    { icon: statSales, bg: '#ebfaf7', value: `${formatNumber(stats.totals.sales)} ₼`, label: 'Ümumi satış' },
    { icon: statProducts, bg: '#fff2e8', value: formatNumber(stats.totals.activeProducts), label: 'Aktiv məhsul' },
    { icon: statDelivery, bg: '#ffedf2', value: formatNumber(stats.totals.delivering), label: 'Çatdırılmada' },
    { icon: statCancelled, bg: '#fff7e5', value: formatNumber(stats.totals.cancelled), label: 'Ləğv edildi' },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-3">
        <h1 className="text-[22px] font-bold text-heading">Ümumi statistika</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className={clsx(controlBox, 'flex w-[300px] max-w-full items-center justify-between px-2.5')}>
            <button
              type="button"
              aria-label="Əvvəlki dövr"
              onClick={() => setOffset((o) => o - 1)}
              className="flex h-[30px] w-[34px] items-center justify-center rounded-md border border-[#e0e3e8] text-lg hover:bg-page"
            >
              ‹
            </button>
            <span>
              {formatDayMonth(stats.start)} – {formatDayMonth(stats.end)}
            </span>
            <button
              type="button"
              aria-label="Növbəti dövr"
              disabled={offset >= 0}
              onClick={() => setOffset((o) => o + 1)}
              className="flex h-[30px] w-[34px] items-center justify-center rounded-md border border-[#e0e3e8] text-lg hover:bg-page disabled:opacity-40"
            >
              ›
            </button>
          </div>
          <DashboardSelect
            value={period}
            onChange={(v) => {
              setPeriod(v)
              setOffset(0)
            }}
            width={150}
            options={[
              { value: 'week', label: 'Həftəlik' },
              { value: 'month', label: 'Aylıq' },
            ]}
          />
          <DashboardSelect
            value={method}
            onChange={setMethod}
            width={210}
            options={[
              { value: 'all', label: 'Bütün sifarişlər' },
              { value: 'address', label: 'Ünvana çatdırılma' },
              { value: 'pickup', label: 'Ünvanımızdan götürmə' },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className={clsx(card, 'flex h-[92px] items-center gap-3 px-3.5 py-3')}>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: k.bg }}>
              <img src={k.icon} width={24} height={24} alt="" />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-2xl font-bold text-heading">{k.value}</span>
              <span className="text-[10.8px] font-medium text-muted-2">{k.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[938fr_486fr]">
        <div className={clsx(card, 'flex min-h-[390px] flex-col gap-3.5 px-4 py-3.5')}>
          <h2 className="text-base font-semibold text-heading">Satışların dinamikası</h2>
          <div className="flex flex-wrap gap-[18px]">
            {SERIES.map((s) => (
              <span key={s.key} className="flex items-center gap-2 text-[10.5px] font-medium text-[#6b7380]">
                <span className="size-2.5 rounded-[2px]" style={{ backgroundColor: s.color }} />
                {s.label}
              </span>
            ))}
          </div>
          <SalesChart days={stats.days} monthly={period === 'month'} />
        </div>
        <div className={clsx(card, 'flex min-h-[390px] flex-col gap-2.5 px-[18px] pb-3.5 pt-4')}>
          <div className="flex h-7 items-center justify-between">
            <h2 className="text-[15px] font-semibold text-heading">Sifariş statusları</h2>
            <span className="text-xs font-bold text-brand">{formatNumber(stats.totals.orders)}</span>
          </div>
          <StatusDonut statuses={stats.statuses} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
        <div className={clsx(card, 'flex flex-col gap-2.5 px-[18px] py-3')}>
          <h2 className="text-[15px] font-semibold text-heading">Kateqoriyalar üzrə satış</h2>
          <CategoryBars categories={stats.categories} />
        </div>
        <div className={clsx(card, 'flex flex-col gap-2.5 px-[18px] py-3')}>
          <h2 className="text-[15px] font-semibold text-heading">Çatdırılma statistikası</h2>
          <div className="grid min-h-[138px] grid-cols-1 items-center gap-3.5 sm:grid-cols-3">
            {[
              { value: stats.deliveries.onTheWay, label: 'Yoldadır', color: '#4d8cf2' },
              { value: stats.deliveries.delivered, label: 'Çatdırıldı', color: '#0a8f73' },
              { value: stats.deliveries.failed, label: 'Uğursuz', color: '#d14242' },
            ].map((d) => (
              <div key={d.label} className="flex h-[104px] flex-col gap-1.5 rounded-[10px] bg-[#f9fafb] pl-3.5 pt-3.5">
                <span className="text-2xl font-bold" style={{ color: d.color }}>
                  {formatNumber(d.value)}
                </span>
                <span className="text-[10.8px] font-medium text-[#757d8a]">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardSelect({ value, onChange, options, width }) {
  const selected = options.find((o) => o.value === value)
  return (
    <div style={{ width }}>
      <Popover
        align="left"
        className="w-full rounded-xl! border-line-soft px-0! py-1.5! shadow-[0_8px_28px_rgba(16,24,40,0.12)]!"
        trigger={({ open, toggle }) => (
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            className={clsx(
              controlBox,
              'flex w-full items-center justify-between pl-3 pr-2.5',
              open && 'border-heading',
            )}
          >
            {selected?.label}
            <ChevronDown size={15} className={clsx('text-[#666e78] transition-transform', open && 'rotate-180')} />
          </button>
        )}
      >
        {(close) =>
          options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value)
                close()
              }}
              className="flex h-10 w-full items-center justify-between px-4 text-left text-sm font-medium text-heading hover:bg-page"
            >
              {o.label}
              {o.value === value && <Check size={16} strokeWidth={2.5} className="text-[#4cb944]" />}
            </button>
          ))
        }
      </Popover>
    </div>
  )
}

/** Qrafiklərin ümumi tooltip-i: başlıq + rəng nişanlı sətirlər ({ color, label, value }). */
function ChartTooltip({ title, rows, className, style }) {
  return (
    <div
      className={clsx(
        'pointer-events-none absolute z-20 w-max max-w-[260px] rounded-lg bg-[#1c1c1e] px-3 py-2.5 text-white shadow-lg',
        className,
      )}
      style={style}
    >
      <p className="mb-1.5 text-xs font-semibold">{title}</p>
      <div className="flex flex-col gap-1">
        {rows.map((r) => (
          <p key={r.label} className="flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: r.color }} />
            {r.label}: {r.value}
          </p>
        ))}
      </div>
    </div>
  )
}

/** Siçanın konteynerə nisbətən mövqeyini izləyən tooltip vəziyyəti. */
function useMouseTooltip() {
  const boxRef = useRef(null)
  const [tip, setTip] = useState(null)
  const show = (e, key) => {
    const r = boxRef.current.getBoundingClientRect()
    setTip({ key, x: e.clientX - r.left, y: e.clientY - r.top })
  }
  return { boxRef, tip, show, hide: () => setTip(null) }
}

// Tooltip siçanın üstündə, mərkəzdə dayanır
const atMouse = (tip) => ({ left: tip.x, top: tip.y, transform: 'translate(-50%, calc(-100% - 12px))' })

/** Qruplaşdırılmış sütun qrafiki: hər gün üçün 3 sütun. Say seriyaları və məbləğ ayrı miqyasdadır. */
function SalesChart({ days, monthly }) {
  const [hovered, setHovered] = useState(null)
  const maxCount = Math.max(1, ...days.flatMap((d) => [d.orders, d.delivering]))
  const maxSales = Math.max(1, ...days.map((d) => d.sales))
  // Figma-da ən hündür sütunlar: say ~110px, məbləğ ~145px (198px-lik sahədə)
  const height = (s, v) => Math.max(2, s === 'sales' ? (v / maxSales) * 145 : (v / maxCount) * 110)
  const format = (s, v) => (s === 'sales' ? `${formatNumber(v)} ₼` : formatNumber(v))

  return (
    <div className="relative h-[250px] w-full overflow-x-auto">
      <div className="relative h-full min-w-[520px]">
        {[18, 64, 110, 156, 202].map((top) => (
          <div key={top} className="absolute inset-x-0 h-px bg-[#eef1f4]" style={{ top }} />
        ))}
        <div className="absolute inset-x-0 top-0 flex h-[216px] items-end justify-around px-6">
          {days.map((d, i) => (
            <div
              key={i}
              className="relative flex h-full items-end gap-1"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {SERIES.map((s) => (
                <div
                  key={s.key}
                  className="w-5 rounded-[5px] transition-[height] duration-300"
                  style={{ height: height(s.key, d[s.key]), backgroundColor: s.color }}
                />
              ))}
              {hovered === i && (
                <ChartTooltip
                  // Ən hündür sütunun üstündə, amma qrafikdən kənara çıxmır (konteyner overflow-x-auto-dur)
                  className={i === 0 ? 'left-0' : i === days.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'}
                  style={{ bottom: Math.min(120, Math.max(...SERIES.map((s) => height(s.key, d[s.key]))) + 10) }}
                  title={`${formatDayMonth(d.date, true)}${monthly ? ' həftəsi' : ''} — Sifariş: ${formatNumber(d.orders)}`}
                  rows={SERIES.map((s) => ({ color: s.color, label: s.label, value: format(s.key, d[s.key]) }))}
                />
              )}
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 top-[228px] flex justify-around px-6">
          {days.map((d, i) => (
            <span key={i} className="w-[68px] text-center text-[9.8px] font-medium text-[#757d87]">
              {formatDayMonth(d.date, true)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusDonut({ statuses }) {
  const total = STATUS_LEGEND.reduce((sum, s) => sum + (statuses[s.key] ?? 0), 0)
  const r = 59
  const circumference = 2 * Math.PI * r
  let offset = 0
  const { boxRef, tip, show, hide } = useMouseTooltip()
  const active = tip && STATUS_LEGEND.find((s) => s.key === tip.key)
  const percent = (value) => (total ? Math.round((value / total) * 100) : 0)

  return (
    // Tooltip həm dairədə, həm də aşağıdakı siyahıda işləyir
    <div ref={boxRef} className="relative flex flex-1 flex-col gap-2.5">
      <div className="relative mx-auto size-[190px]">
        <svg viewBox="0 0 190 190" className="size-full -rotate-90">
          <circle cx="95" cy="95" r={r} fill="none" stroke="#eef1f4" strokeWidth="22" />
          {total > 0 &&
            STATUS_LEGEND.map((s) => {
              const value = statuses[s.key] ?? 0
              const length = (value / total) * circumference
              const segment = (
                <circle
                  key={s.key}
                  cx="95"
                  cy="95"
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="22"
                  strokeDasharray={`${Math.max(0, length - 1.5)} ${circumference}`}
                  strokeDashoffset={-offset}
                  className="cursor-pointer transition-opacity"
                  // Seçilən seqment önə çıxır, qalanları solğunlaşır
                  opacity={tip && tip.key !== s.key ? 0.35 : 1}
                  onMouseMove={(e) => show(e, s.key)}
                  onMouseLeave={hide}
                />
              )
              offset += length
              return segment
            })}
        </svg>
        {/* pointer-events-none: yoxsa bu qat seqmentlərin üstünü örtür və hover işləmir */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-heading">{formatNumber(total)}</span>
          <span className="text-[10.5px] font-medium text-[#7a828f]">sifariş</span>
        </div>
      </div>
      {active && (
        <ChartTooltip
          style={atMouse(tip)}
          title={`${active.label} — ${percent(statuses[active.key] ?? 0)}%`}
          rows={[{ color: active.color, label: 'Sifariş', value: formatNumber(statuses[active.key] ?? 0) }]}
        />
      )}
      <div className="mt-auto flex flex-col gap-1">
        {STATUS_LEGEND.map((s) => {
          const value = statuses[s.key] ?? 0
          return (
            <div
              key={s.key}
              className={clsx(
                '-mx-1.5 flex h-[18px] cursor-pointer items-center justify-between rounded px-1.5 text-[10.5px]',
                tip?.key === s.key && 'bg-page',
              )}
              onMouseMove={(e) => show(e, s.key)}
              onMouseLeave={hide}
            >
              <span className="flex items-center gap-2 font-medium text-heading">
                <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.label}
              </span>
              <span className="flex gap-2">
                <span className="font-semibold text-heading">{formatNumber(value)}</span>
                <span className="w-8 text-right font-medium text-[#7a828f]">{percent(value)}%</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CategoryBars({ categories }) {
  const max = Math.max(1, ...categories.map((c) => c.sales))
  const total = categories.reduce((sum, c) => sum + c.sales, 0)
  const { boxRef, tip, show, hide } = useMouseTooltip()
  const active = tip && categories.find((c) => c.name === tip.key)

  return (
    <div ref={boxRef} className="relative flex min-h-[138px] flex-col justify-center gap-[13px]">
      {active && (
        <ChartTooltip
          style={atMouse(tip)}
          title={`${active.name} — ${total ? Math.round((active.sales / total) * 100) : 0}%`}
          rows={[{ color: 'var(--color-brand)', label: 'Satış', value: `${formatNumber(active.sales)} ₼` }]}
        />
      )}
      {categories.map((c) => (
        <div key={c.name} className="flex cursor-pointer items-center" onMouseMove={(e) => show(e, c.name)} onMouseLeave={hide}>
          <span className="w-[110px] shrink-0 text-[10.5px] font-medium text-[#707885]">{c.name}</span>
          <div className="h-3.5 max-w-[520px] flex-1 overflow-hidden rounded-[7px] bg-[#f0f2f5]">
            {/* Ən çox satan kateqoriya zolağın ~85%-ni tutur (Figma: 440/520) */}
            <div
              className="h-full rounded-[7px] bg-brand transition-[width] duration-300"
              style={{ width: `${(c.sales / max) * 85}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
