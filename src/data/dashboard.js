// Panel statistikası. Backend-də bu, bir "statistika" endpoint-indən gələcək.
// Cari həftə (12–18 Oktyabr 2026) Figma-dakı rəqəmlərdir, digər həftələr üçün sabit nümunə data yaradılır.

const CURRENT_WEEK_START = new Date('2026-10-12T00:00:00')

const CURRENT_WEEK = {
  days: [
    { orders: 70, sales: 1900, delivering: 25 },
    { orders: 100, sales: 2600, delivering: 30 },
    { orders: 130, sales: 3400, delivering: 20 },
    { orders: 40, sales: 1100, delivering: 28 },
    { orders: 75, sales: 1800, delivering: 12 },
    { orders: 90, sales: 2300, delivering: 34 },
    { orders: 72, sales: 1760, delivering: 12 },
  ],
  totals: { orders: 1284, sales: 48920, activeProducts: 326, delivering: 57, cancelled: 81 },
  statuses: { completed: 836, new: 184, preparing: 126, delivering: 57, cancelled: 81 },
  categories: [
    { name: 'Ayaqaltı', sales: 8800 },
    { name: 'Ətir', sales: 7200 },
    { name: 'Telefon', sales: 6400 },
    { name: 'Oturacaq', sales: 5200 },
    { name: 'Təmizlik', sales: 4600 },
  ],
  deliveries: { onTheWay: 57, delivered: 836, failed: 12 },
}

/** Eyni həftə üçün həmişə eyni nəticə verən sadə təsadüfi ədəd generatoru */
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const scale = (n, k) => Math.max(0, Math.round(n * k))

function weekStats(offset) {
  if (offset === 0) return CURRENT_WEEK
  const rand = seeded(Math.abs(offset) * 7919 + 13)
  const k = 0.6 + rand() * 0.8
  const c = CURRENT_WEEK
  return {
    days: c.days.map((d) => {
      const j = 0.5 + rand()
      return { orders: scale(d.orders, k * j), sales: scale(d.sales, k * j), delivering: scale(d.delivering, k * (0.5 + rand())) }
    }),
    totals: {
      orders: scale(c.totals.orders, k),
      sales: scale(c.totals.sales, k),
      activeProducts: c.totals.activeProducts,
      delivering: scale(c.totals.delivering, k),
      cancelled: scale(c.totals.cancelled, k),
    },
    statuses: Object.fromEntries(Object.entries(c.statuses).map(([key, v]) => [key, scale(v, k)])),
    categories: c.categories.map((cat) => ({ ...cat, sales: scale(cat.sales, k * (0.7 + rand() * 0.6)) })),
    deliveries: {
      onTheWay: scale(c.deliveries.onTheWay, k),
      delivered: scale(c.deliveries.delivered, k),
      failed: scale(c.deliveries.failed, k),
    },
  }
}

/** Sifariş növü filtrinə görə rəqəmləri təxmini bölür (ünvana ~70%, götürmə ~30%) */
const METHOD_SHARE = { all: 1, address: 0.7, pickup: 0.3 }

export function getDashboardStats({ weekOffset, method }) {
  const share = METHOD_SHARE[method] ?? 1
  const s = weekStats(weekOffset)
  const start = new Date(CURRENT_WEEK_START)
  start.setDate(start.getDate() + weekOffset * 7)
  const dates = s.days.map((_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d
  })
  const part = (n) => scale(n, share)
  return {
    start,
    end: dates[6],
    days: s.days.map((d, i) => ({
      date: dates[i],
      orders: part(d.orders),
      sales: part(d.sales),
      delivering: method === 'pickup' ? 0 : part(d.delivering),
    })),
    totals: {
      orders: part(s.totals.orders),
      sales: part(s.totals.sales),
      activeProducts: s.totals.activeProducts,
      delivering: method === 'pickup' ? 0 : part(s.totals.delivering),
      cancelled: part(s.totals.cancelled),
    },
    statuses: Object.fromEntries(
      Object.entries(s.statuses).map(([k, v]) => [k, k === 'delivering' && method === 'pickup' ? 0 : part(v)]),
    ),
    categories: s.categories.map((c) => ({ ...c, sales: part(c.sales) })),
    deliveries:
      method === 'pickup'
        ? { onTheWay: 0, delivered: 0, failed: 0 }
        : {
            onTheWay: part(s.deliveries.onTheWay),
            delivered: part(s.deliveries.delivered),
            failed: part(s.deliveries.failed),
          },
  }
}

/** Aylıq görünüş: son 4 həftənin cəmi, gün əvəzinə həftələr */
export function getMonthlyStats({ monthOffset, method }) {
  const weeks = [3, 2, 1, 0].map((i) => getDashboardStats({ weekOffset: monthOffset * 4 - i, method }))
  const sum = (pick) => weeks.reduce((a, w) => a + pick(w), 0)
  const sumObj = (pick) => {
    const keys = Object.keys(pick(weeks[0]))
    return Object.fromEntries(keys.map((k) => [k, sum((w) => pick(w)[k])]))
  }
  return {
    start: weeks[0].start,
    end: weeks[3].end,
    days: weeks.map((w) => ({
      date: w.start,
      orders: w.days.reduce((a, d) => a + d.orders, 0),
      sales: w.days.reduce((a, d) => a + d.sales, 0),
      delivering: w.days.reduce((a, d) => a + d.delivering, 0),
    })),
    totals: { ...sumObj((w) => w.totals), activeProducts: weeks[3].totals.activeProducts },
    statuses: sumObj((w) => w.statuses),
    categories: weeks[3].categories.map((c, i) => ({ ...c, sales: sum((w) => w.categories[i].sales) })),
    deliveries: sumObj((w) => w.deliveries),
  }
}
