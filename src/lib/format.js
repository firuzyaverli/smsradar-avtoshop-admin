const MONTHS = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'İyun',
  'İyul',
  'Avqust',
  'Sentyabr',
  'Oktyabr',
  'Noyabr',
  'Dekabr',
]

const pad = (n) => String(n).padStart(2, '0')

/** 49.9 → "49.90 ₼" */
export function formatMoney(value) {
  return `${value.toFixed(2)} ₼`
}

/** 48920 → "48 920" */
export function formatNumber(value) {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/** ISO → "08 Oktyabr 12:30" */
export function formatDateLong(iso) {
  const d = new Date(iso)
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** ISO → "18.10.2026 13:42" */
export function formatDateShort(iso) {
  const d = new Date(iso)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Date → "12 okt" (lower) və ya "12 Okt" */
export function formatDayMonth(date, capitalize = false) {
  const m = MONTHS[date.getMonth()].slice(0, 3)
  return `${date.getDate()} ${capitalize ? m : m.toLocaleLowerCase('az')}`
}

export function formatYearRange(from, to) {
  if (from == null && to == null) return '—'
  return `${from ?? ''}–${to ?? ''}`
}
