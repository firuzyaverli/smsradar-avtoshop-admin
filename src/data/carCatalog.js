// Uyğunluq formasında marka → model seçimi üçün kataloq. Backend-də ayrıca endpoint olacaq.
export const carCatalog = {
  BMW: ['1 Series', '3 Series', '5 Series', 'X1', 'X3', 'X5'],
  Chevrolet: ['Cruze', 'Malibu', 'Captiva', 'Lacetti'],
  Ford: ['Focus', 'Fusion', 'Mondeo', 'Escape', 'Explorer'],
  Honda: ['Accord', 'Civic', 'CR-V', 'Fit'],
  Hyundai: ['Accent', 'Elantra', 'Sonata', 'Santa Fe', 'Tucson'],
  Kia: ['Cerato', 'Optima', 'Rio', 'Sorento', 'Sportage'],
  Lexus: ['ES', 'GX', 'LX', 'RX'],
  'Mercedes': ['A-Class', 'C-Class', 'E-Class', 'GLE', 'S-Class'],
  Mitsubishi: ['Lancer', 'Outlander', 'Pajero'],
  Nissan: ['Altima', 'Juke', 'Qashqai', 'X-Trail'],
  Toyota: ['Camry', 'Corolla', 'Land Cruiser', 'Prado', 'RAV4'],
  Volkswagen: ['Golf', 'Jetta', 'Passat', 'Tiguan'],
}

export const brands = Object.keys(carCatalog).sort((a, b) => a.localeCompare(b, 'az'))

const CURRENT_YEAR = new Date().getFullYear()

/** Ən yenidən köhnəyə: gələn il ... 1995 */
export const years = Array.from({ length: CURRENT_YEAR + 2 - 1995 }, (_, i) => CURRENT_YEAR + 1 - i)
