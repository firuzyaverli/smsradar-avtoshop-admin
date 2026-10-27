export const activeStatusStyles = {
  active: { label: 'Aktiv', bg: '#e5f7f2', fg: '#0a8f73' },
  inactive: { label: 'Deaktiv', bg: '#fcf0f0', fg: '#e5212e' },
}

export const outOfStockStyle = { label: 'Stok yoxdur', bg: '#fcf0f0', fg: '#e58c1a' }

export const orderStatusStyles = {
  new: { label: 'Yeni', bg: '#ebf2ff', fg: '#3378e0' },
  confirmed: { label: 'Təsdiqləndi', bg: '#ebfaf5', fg: '#0a8f73' },
  preparing: { label: 'Hazırlanır', bg: '#fff7e5', fg: '#f5a31f' },
  shipping: { label: 'Çatdırılır', bg: '#f2edff', fg: '#7057d1' },
  ready_for_pickup: { label: 'Götürməyə hazır', bg: '#fff7e5', fg: '#f5a31f' },
  completed: { label: 'Tamamlandı', bg: '#ebfaf5', fg: '#0a8f73' },
  cancelled: { label: 'Ləğv edildi', bg: '#ffedf0', fg: '#e52e40' },
}

export const deliveryStatusStyles = {
  handed_to_cargo: { label: 'Cargo-ya ötürüldü', bg: '#e8f2fc', fg: '#2973c2' },
  cargo_accepted: { label: 'Cargo qəbul etdi', bg: '#e8f2fc', fg: '#2973c2' },
  courier_assigned: { label: 'Kuryer təyin edildi', bg: '#fcf2e0', fg: '#b86e14' },
  courier_picked_up: { label: 'Kuryer götürdü', bg: '#fcf2e0', fg: '#b86e14' },
  on_the_way: { label: 'Yoldadır', bg: '#e8f2fc', fg: '#2973c2' },
  delivered: { label: 'Çatdırıldı', bg: '#e5f7f0', fg: '#0a8f73' },
  failed: { label: 'Çatdırılma uğursuz', bg: '#fcebeb', fg: '#c73333' },
}

export const deliveryMethodLabels = {
  address: { short: 'Ünvana', long: 'Ünvana çatdırılma' },
  pickup: { short: 'Götürmə', long: 'Ünvanımızdan götürmə' },
}

export const paymentMethodLabels = {
  card: 'Kart',
  cash: 'Nağd',
}
