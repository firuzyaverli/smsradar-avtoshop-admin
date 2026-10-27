import { formatYearRange } from './format'
import { activeStatusStyles, outOfStockStyle } from './statuses'

export const LOW_STOCK_THRESHOLD = 5

/** "Universal" və ya "Ford Fusion 2017–2020" */
export function compatibilityLabel(c) {
  if (!c) return '—'
  if (c.type === 'universal') return c.name
  return `${c.brand} ${c.model} ${formatYearRange(c.yearFrom, c.yearTo)}`
}

export function productStatusStyle(p) {
  if (p.status === 'active' && p.stock === 0) return outOfStockStyle
  return activeStatusStyles[p.status]
}

/** Stok rəngi: 0 — qırmızı, az — narıncı, normal — tünd */
export function stockColorClass(stock) {
  if (stock === 0) return 'text-danger-text'
  if (stock < LOW_STOCK_THRESHOLD) return 'text-warning'
  return 'text-ink'
}

export function orderSubtotal(o) {
  return o.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
}

export function orderTotal(o) {
  return orderSubtotal(o) + o.deliveryFee
}
