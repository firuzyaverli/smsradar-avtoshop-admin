/**
 * Filtr sahəsinin konfiqurasiyası:
 *   { id, label, type: 'select' | 'dateRange' | 'numberRange', options?, match(row, value) }
 * select — options: [{ value, label }] və ya (values) => [...] (məs. Model markadan asılıdır)
 *          dependsOn: 'brand' — ana sahə dəyişəndə təmizlənir, ana sahə boşdursa deaktiv olur
 * dateRange  — dəyər: { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
 * numberRange — dəyər: { min: '10', max: '50' }
 */

/** { key: { label } } → [{ value, label }] (status xəritələri üçün) */
export function optionsFromLabels(map) {
  return Object.entries(map).map(([value, item]) => ({ value, label: typeof item === 'string' ? item : item.label }))
}

/** Təkrarsız, əlifba sırası ilə seçimlər */
export function uniqueOptions(values) {
  return [...new Set(values.filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), 'az'))
    .map((v) => ({ value: String(v), label: String(v) }))
}

export function isEmptyFilter(value) {
  if (value == null || value === '') return true
  if (typeof value === 'object') return Object.values(value).every((v) => v == null || v === '')
  return false
}

export function countActiveFilters(values) {
  return Object.values(values).filter((v) => !isEmptyFilter(v)).length
}

/** Bütün dolu filtrlərə uyğun gələn sətirlər */
export function filterRows(rows, fields, values) {
  const active = fields.filter((f) => !isEmptyFilter(values[f.id]))
  if (!active.length) return rows
  return rows.filter((row) => active.every((f) => f.match(row, values[f.id])))
}

const pad = (n) => String(n).padStart(2, '0')

/** Date → 'YYYY-MM-DD' (yerli vaxtla) */
export function toDateKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Tarix aralığına düşürmü (günlər daxil olmaqla) */
export function inDateRange(iso, { from, to }) {
  const day = toDateKey(iso)
  return (!from || day >= from) && (!to || day <= to)
}

/** Ədəd aralığına düşürmü */
export function inNumberRange(value, { min, max }) {
  return (min === '' || min == null || value >= Number(min)) && (max === '' || max == null || value <= Number(max))
}

/** Tarix sahəsindəki hazır aralıqlar */
export function datePresets(today = new Date()) {
  const day = (offset) => {
    const d = new Date(today)
    d.setDate(d.getDate() + offset)
    return toDateKey(d)
  }
  const monthStart = toDateKey(new Date(today.getFullYear(), today.getMonth(), 1))
  return [
    { label: 'Bu gün', value: { from: day(0), to: day(0) } },
    { label: 'Dünən', value: { from: day(-1), to: day(-1) } },
    { label: 'Son 7 gün', value: { from: day(-6), to: day(0) } },
    { label: 'Son 30 gün', value: { from: day(-29), to: day(0) } },
    { label: 'Bu ay', value: { from: monthStart, to: day(0) } },
  ]
}
