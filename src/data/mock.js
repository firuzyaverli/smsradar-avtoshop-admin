// Backend hazır olana qədər istifadə olunan nümunə data (Figma dizaynındakı dəyərlər).
const img = (n) => `/mock/product-${n}.jpg`

export const categories = [
  { id: 'cat-1', name: 'Ayaqaltılar', status: 'active', createdAt: '2026-10-14T14:35:00' },
  { id: 'cat-2', name: 'Ətirlər', status: 'active', createdAt: '2026-10-14T13:10:00' },
  { id: 'cat-3', name: 'Telefon aksesuarları', status: 'active', createdAt: '2026-10-13T12:45:00' },
  { id: 'cat-4', name: 'Oturacaq aksesuarları', status: 'active', createdAt: '2026-10-12T11:20:00' },
  { id: 'cat-5', name: 'Təmizlik və baxım', status: 'active', createdAt: '2026-10-11T18:05:00' },
  { id: 'cat-6', name: 'Salon aksesuarları', status: 'inactive', createdAt: '2026-10-11T16:42:00' },
  { id: 'cat-7', name: 'Avtomobil təşkilatçıları', status: 'active', createdAt: '2026-10-10T15:20:00' },
  { id: 'cat-8', name: 'Digər aksesuarlar', status: 'active', createdAt: '2026-10-10T19:05:00' },
]

const compat = (id, brand, model, yearFrom, yearTo, createdAt, status = 'active') => ({
  id,
  name: `${brand} ${model}`,
  type: 'specific',
  brand,
  model,
  yearFrom,
  yearTo,
  status,
  createdAt,
})

export const compatibilities = [
  {
    id: 'cmp-1',
    name: 'Universal',
    type: 'universal',
    brand: null,
    model: null,
    yearFrom: null,
    yearTo: null,
    status: 'active',
    createdAt: '2026-10-01T10:00:00',
  },
  compat('cmp-2', 'Ford', 'Fusion', 2017, 2020, '2026-10-02T10:00:00'),
  compat('cmp-3', 'Toyota', 'Camry', 2018, 2022, '2026-10-02T11:00:00'),
  compat('cmp-4', 'Hyundai', 'Elantra', 2019, 2023, '2026-10-03T10:00:00'),
  compat('cmp-5', 'Kia', 'Sportage', 2020, 2024, '2026-10-03T12:00:00'),
  compat('cmp-6', 'Mercedes', 'C-Class', 2016, 2021, '2026-10-04T10:00:00', 'inactive'),
  compat('cmp-7', 'BMW', '3 Series', 2019, 2024, '2026-10-04T14:00:00'),
  compat('cmp-8', 'Honda', 'Civic', 2018, 2023, '2026-10-05T10:00:00'),
]

const product = (
  id,
  name,
  categoryId,
  compatibilityId,
  price,
  stock,
  image,
  createdAt,
  status = 'active',
  description = '',
) => ({
  id,
  name,
  categoryId,
  compatibilityId,
  price,
  stock,
  status,
  description,
  images: [{ id: `${id}-img-1`, url: img(image), rotation: 0 }],
  createdAt,
})

export const products = [
  product(
    'p-1',
    '3D Ayaqaltı dəsti',
    'cat-1',
    'cmp-1',
    49.9,
    12,
    1,
    '2026-10-08T12:30:00',
    'active',
    'Yüksək keyfiyyətli, su keçirməyən 3D ayaqaltı dəsti. Avtomobil salonunu kir və sudan qoruyur.',
  ),
  product('p-2', 'Avtomobil ətri', 'cat-2', 'cmp-1', 12, 28, 2, '2026-10-08T11:45:00'),
  product('p-3', 'Telefon tutacağı', 'cat-3', 'cmp-2', 19.9, 4, 3, '2026-10-08T10:19:00'),
  product('p-4', 'Oturacaq üzlükləri', 'cat-4', 'cmp-1', 89.9, 0, 4, '2026-10-08T07:46:00'),
  product('p-5', '3D Ayaqaltı Premium', 'cat-1', 'cmp-1', 59.9, 7, 1, '2026-10-08T07:37:00'),
  product('p-6', 'Avtomobil ətri — Ocean', 'cat-2', 'cmp-1', 15, 18, 2, '2026-10-08T02:11:00', 'inactive'),
  product('p-7', 'Sükan üzlüyü', 'cat-6', 'cmp-1', 24.9, 9, 3, '2026-10-07T23:18:00'),
  product('p-8', 'Telefon üçün maqnit', 'cat-3', 'cmp-1', 14.9, 2, 2, '2026-10-07T20:54:00'),
]

const item = (productId, name, image, price, quantity) => ({
  productId,
  name,
  image: img(image),
  price,
  quantity,
  compatibility: 'Universal',
})

/** Ünvana çatdırılan sifariş (cargo ilə) */
const addressOrder = (n, customer, phone, address, paymentMethod, status, items, createdAt) => ({
  id: `AM-${n}`,
  customer,
  phone,
  deliveryMethod: 'address',
  paymentMethod,
  address,
  deliveryFee: 5,
  note: '',
  status,
  items,
  pickup: null,
  createdAt,
})

// Ən yenidən köhnəyə. AM-10242–10249 çatdırılma mərhələsindədir (aşağıdakı "deliveries" ilə bağlıdır).
export const orders = [
  addressOrder(10249, 'Elvin Məmmədov', '+994 50 555 44 33', 'Bakı, Nərimanov r., Ağa Neymətulla küç. 42', 'card', 'shipping',
    [item('p-5', '3D Ayaqaltı Premium', 1, 59.9, 1)], '2026-10-17T18:20:00'),
  addressOrder(10248, 'Nigar Əliyeva', '+994 55 610 22 18', 'Bakı, Yasamal r., M. Xiyabani küç. 18', 'cash', 'shipping',
    [item('p-2', 'Avtomobil ətri', 2, 12, 2), item('p-8', 'Telefon üçün maqnit', 2, 14.9, 1)], '2026-10-17T16:05:00'),
  addressOrder(10247, 'Tural Həsənov', '+994 70 344 51 09', 'Bakı, Xətai r., Babək pr. 77', 'card', 'shipping',
    [item('p-4', 'Oturacaq üzlükləri', 4, 89.9, 1)], '2026-10-17T11:40:00'),
  addressOrder(10246, 'Aysel Quliyeva', '+994 51 227 63 40', 'Bakı, Binəqədi r., Azadlıq pr. 154', 'card', 'completed',
    [item('p-1', '3D Ayaqaltı dəsti', 1, 49.9, 1), item('p-7', 'Sükan üzlüyü', 3, 24.9, 1)], '2026-10-16T19:10:00'),
  addressOrder(10245, 'Murad Rzayev', '+994 50 731 08 66', 'Bakı, Səbail r., Badamdar qəs. 3-cü massiv', 'cash', 'shipping',
    [item('p-3', 'Telefon tutacağı', 3, 19.9, 2)], '2026-10-16T15:30:00'),
  addressOrder(10244, 'Leyla İsmayılova', '+994 55 918 47 25', 'Bakı, Nəsimi r., 28 May küç. 21', 'card', 'shipping',
    [item('p-6', 'Avtomobil ətri — Ocean', 2, 15, 3)], '2026-10-15T20:45:00'),
  addressOrder(10243, 'Orxan Əliyev', '+994 70 402 19 93', 'Bakı, Sabunçu r., Bakıxanov qəs.', 'cash', 'shipping',
    [item('p-5', '3D Ayaqaltı Premium', 1, 59.9, 1), item('p-2', 'Avtomobil ətri', 2, 12, 1)], '2026-10-14T17:25:00'),
  addressOrder(10242, 'Ramil Məmmədli', '+994 51 650 72 14', 'Bakı, Xəzər r., Mərdəkan qəs.', 'card', 'completed',
    [item('p-8', 'Telefon üçün maqnit', 2, 14.9, 2)], '2026-10-13T12:10:00'),
  {
    id: 'AM-10241',
    customer: 'Aysel Məmmədova',
    phone: '+994 50 123 45 67',
    deliveryMethod: 'address',
    paymentMethod: 'card',
    address: 'Bakı, Nərimanov r., Təbriz küç. 18',
    deliveryFee: 5,
    note: 'Müştəri zəng etmədən çatdırılmasını xahiş edir.',
    status: 'new',
    items: [item('p-1', '3D Ayaqaltı dəsti', 1, 49.9, 1), item('p-6', 'Avtomobil ətri — Ocean', 2, 17.45, 2)],
    pickup: null,
    createdAt: '2026-10-12T14:35:00',
  },
  {
    id: 'AM-10240',
    customer: 'Elvin Əliyev',
    phone: '+994 55 321 44 10',
    deliveryMethod: 'pickup',
    paymentMethod: 'cash',
    address: 'SMSRadar Avto Market — Bakı, Nərimanov r.',
    deliveryFee: 0,
    note: '',
    status: 'ready_for_pickup',
    items: [item('p-1', '3D Ayaqaltı dəsti', 1, 49.9, 1)],
    pickup: { code: 'PU-4821', window: '15 Oktyabr, 10:00–18:00' },
    createdAt: '2026-10-12T13:10:00',
  },
  {
    id: 'AM-10239',
    customer: 'Nigar Həsənova',
    phone: '+994 70 777 18 22',
    deliveryMethod: 'address',
    paymentMethod: 'card',
    address: 'Bakı, Yasamal r., Şərifzadə küç. 7',
    deliveryFee: 5,
    note: '',
    status: 'preparing',
    items: [
      item('p-4', 'Oturacaq üzlükləri', 4, 89.9, 1),
      item('p-3', 'Telefon tutacağı', 3, 19.9, 1),
      item('p-8', 'Telefon üçün maqnit', 2, 14.9, 1),
    ],
    pickup: null,
    createdAt: '2026-10-12T12:45:00',
  },
  {
    id: 'AM-10238',
    customer: 'Murad Quliyev',
    phone: '+994 51 602 09 80',
    deliveryMethod: 'address',
    paymentMethod: 'cash',
    address: 'Bakı, Xətai r., Babək pr. 77',
    deliveryFee: 5,
    note: '',
    status: 'shipping',
    items: [item('p-6', 'Avtomobil ətri — Ocean', 2, 15, 2)],
    pickup: null,
    createdAt: '2026-10-12T11:20:00',
  },
  {
    id: 'AM-10237',
    customer: 'Leyla Rzayeva',
    phone: '+994 50 888 30 40',
    deliveryMethod: 'pickup',
    paymentMethod: 'card',
    address: 'SMSRadar Avto Market — Bakı, Nərimanov r.',
    deliveryFee: 0,
    note: '',
    status: 'completed',
    items: [item('p-1', '3D Ayaqaltı dəsti', 1, 49.9, 1), item('p-6', 'Avtomobil ətri — Ocean', 2, 15, 2)],
    pickup: { code: 'PU-4790', window: '12 Oktyabr, 10:00–18:00' },
    createdAt: '2026-10-11T18:05:00',
  },
  {
    id: 'AM-10236',
    customer: 'Tural İsmayılov',
    phone: '+994 55 404 20 11',
    deliveryMethod: 'address',
    paymentMethod: 'card',
    address: 'Bakı, Nəsimi r., 28 May küç. 21',
    deliveryFee: 5,
    note: '',
    status: 'cancelled',
    items: [item('p-3', 'Telefon tutacağı', 3, 19.9, 1)],
    pickup: null,
    createdAt: '2026-10-11T16:42:00',
  },
  {
    id: 'AM-10235',
    customer: 'Rauf Hüseynov',
    phone: '+994 50 202 11 45',
    deliveryMethod: 'address',
    paymentMethod: 'card',
    address: 'Bakı, Binəqədi r., Azadlıq pr. 154',
    deliveryFee: 5,
    note: '',
    status: 'new',
    items: [item('p-7', 'Sükan üzlüyü', 3, 24.9, 1), item('p-6', 'Avtomobil ətri — Ocean', 2, 15, 2)],
    pickup: null,
    createdAt: '2026-10-11T15:20:00',
  },
  {
    id: 'AM-10234',
    customer: 'Sevda Məmmədli',
    phone: '+994 55 700 44 33',
    deliveryMethod: 'pickup',
    paymentMethod: 'cash',
    address: 'SMSRadar Avto Market — Bakı, Nərimanov r.',
    deliveryFee: 0,
    note: '',
    status: 'completed',
    items: [item('p-1', '3D Ayaqaltı dəsti', 1, 49.9, 2)],
    pickup: { code: 'PU-4755', window: '11 Oktyabr, 10:00–18:00' },
    createdAt: '2026-10-10T19:05:00',
  },
]

const DELIVERY_FLOW = [
  { status: 'handed_to_cargo', description: 'Sifariş cargo sisteminə uğurla göndərildi.' },
  { status: 'cargo_accepted', description: 'Göndəriş cargo tərəfindən qəbul edildi.' },
  { status: 'courier_assigned', description: 'Çatdırılma üçün kuryer təyin edildi.' },
  { status: 'courier_picked_up', description: 'Sifariş kuryer tərəfindən götürüldü.' },
  { status: 'on_the_way', description: 'Sifariş çatdırılma ünvanına doğru hərəkətdədir.' },
  { status: 'delivered', description: 'Sifariş müştəriyə təhvil verildi.' },
]

/** Cari statusa qədər olan tarixçəni yaradır (hər addım arasında bir neçə dəqiqə). */
function buildHistory(status, updatedAt) {
  const end = new Date(updatedAt).getTime()
  const steps =
    status === 'failed'
      ? [...DELIVERY_FLOW.slice(0, 5), { status: 'failed', description: 'Müştəri ilə əlaqə saxlamaq mümkün olmadı.' }]
      : DELIVERY_FLOW.slice(0, DELIVERY_FLOW.findIndex((s) => s.status === status) + 1)
  return steps.map((step, i) => ({
    ...step,
    at: new Date(end - (steps.length - 1 - i) * 19 * 60_000).toISOString(),
  }))
}

/** Çatdırılma sifarişdən yaranır: müştəri, telefon, ünvan və haqq sifarişdən götürülür */
function delivery(orderId, trackingId, status, updatedAt) {
  const order = orders.find((o) => o.id === orderId)
  return {
    id: `dl-${orderId.slice(3)}`,
    orderId,
    customer: order.customer,
    phone: order.phone,
    cargo: 'Cargo X',
    trackingId,
    address: order.address,
    fee: order.deliveryFee,
    status,
    updatedAt,
    history: buildHistory(status, updatedAt),
  }
}

export const deliveries = [
  delivery('AM-10249', 'TRK-892314', 'on_the_way', '2026-10-18T13:42:00'),
  delivery('AM-10248', 'TRK-892287', 'courier_assigned', '2026-10-18T13:18:00'),
  delivery('AM-10247', 'TRK-892251', 'cargo_accepted', '2026-10-18T12:56:00'),
  delivery('AM-10246', 'TRK-892208', 'delivered', '2026-10-18T12:31:00'),
  delivery('AM-10245', 'TRK-892176', 'handed_to_cargo', '2026-10-18T12:04:00'),
  delivery('AM-10244', 'TRK-892140', 'on_the_way', '2026-10-18T11:37:00'),
  delivery('AM-10243', 'TRK-892101', 'failed', '2026-10-18T11:06:00'),
  delivery('AM-10242', 'TRK-892063', 'delivered', '2026-10-18T10:44:00'),
  delivery('AM-10238', 'TRK-891977', 'courier_picked_up', '2026-10-13T10:20:00'),
]
