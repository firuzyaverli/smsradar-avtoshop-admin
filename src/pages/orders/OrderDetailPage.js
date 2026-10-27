import { DetailPage } from '@/components/layout'
import {
  BulkActionButton,
  Button,
  ConfirmDialog,
  DataTable,
  Field,
  FormCard,
  Input,
  RowActions,
  Select,
  StatusPill,
  Tabs,
  Textarea,
  UnsavedChangesDialog,
} from '@/components/ui'
import { ordersStore, useDeliveries, useOrders, useProducts } from '@/data/store'
import { orderSubtotal, orderTotal, productStatusStyle } from '@/lib/domain'
import { formatMoney } from '@/lib/format'
import { deliveryMethodLabels, deliveryStatusStyles, orderStatusStyles, paymentMethodLabels } from '@/lib/statuses'
import { toast } from '@/lib/toast'
import { useUnsavedChanges } from '@/lib/useUnsavedChanges'
import { NotFoundPage } from '@/pages/notFound/NotFoundPage'
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'

const TABS = [
  { key: 'view', label: 'Görünüş' },
  { key: 'status', label: 'Ümumi' },
  { key: 'items', label: 'Məhsullar' },
]

/** Çatdırılma növünə görə seçilə bilən statuslar */
const STATUS_FLOW = {
  address: ['new', 'confirmed', 'preparing', 'shipping', 'completed', 'cancelled'],
  pickup: ['new', 'confirmed', 'preparing', 'ready_for_pickup', 'completed', 'cancelled'],
}

export function OrderDetailPage() {
  const { id } = useParams()
  const order = useOrders().find((o) => o.id === id)
  if (!order) return <NotFoundPage title="Sifariş tapılmadı" />
  return <OrderDetail key={order.id} order={order} />
}

function OrderDetail({ order }) {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const tab = TABS.some((t) => t.key === requested) ? requested : 'view'
  const [status, setStatus] = useState(order.status)
  const [note, setNote] = useState(order.note)
  const { blocker, allowNavigation } = useUnsavedChanges(status !== order.status || note !== order.note)

  const isPickup = order.deliveryMethod === 'pickup'
  const delivery = useDeliveries().find((d) => d.orderId === order.id)
  const close = () => navigate('/orders')

  const save = () => {
    ordersStore.update(order.id, { status, note: note.trim() })
    toast('Sifariş yeniləndi')
    allowNavigation()
    navigate('/orders')
  }

  const titles = {
    view: 'Sifariş məlumatı',
    status: 'Sifariş statusu',
    items: 'Sifariş məhsulları',
  }
  const title = tab !== 'items' && isPickup ? `${titles[tab]} — Ünvanımızdan götürmə` : titles[tab]

  return (
    <DetailPage
      title={title}
      backTo="/orders"
      tabs={<Tabs tabs={TABS} active={tab} onChange={(key) => setParams({ tab: key }, { replace: true })} />}
      footer={
        <>
          {tab === 'status' && <Button onClick={save}>Yadda saxla</Button>}
          <Button variant="danger" onClick={close}>
            Bağla
          </Button>
        </>
      }
    >
      {tab === 'items' ? (
        <OrderItems order={order} />
      ) : (
        <div className="flex flex-col gap-3">
          {isPickup && (
            <div className="flex min-h-12 items-center rounded-lg bg-[#edfaf6] px-4 py-2 text-xs font-medium text-brand">
              Bu sifariş cargo-ya ötürülmür. Müştəri seçilmiş ünvandan sifarişi özü təhvil alır.
            </div>
          )}
          {delivery && (
            <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 rounded-lg bg-[#e8f2fc] px-4 py-2 text-xs font-medium text-[#2973c2]">
              <span>
                Sifariş cargo-ya ötürülüb: {delivery.cargo}, {delivery.trackingId} —{' '}
                {deliveryStatusStyles[delivery.status].label}
              </span>
              <Link to={`/deliveries/${delivery.id}`} className="font-semibold hover:underline">
                Çatdırılmaya bax →
              </Link>
            </div>
          )}
          <OrderInfoForm
            order={order}
            editable={tab === 'status'}
            status={status}
            onStatusChange={setStatus}
            note={note}
            onNoteChange={setNote}
          />
        </div>
      )}
      <UnsavedChangesDialog blocker={blocker} />
    </DetailPage>
  )
}

function OrderInfoForm({ order, editable, status, onStatusChange, note, onNoteChange }) {
  const isPickup = order.deliveryMethod === 'pickup'
  const ro = (label, value) => (
    <Field label={label}>
      <Input value={value} disabled readOnly />
    </Field>
  )

  return (
    <FormCard>
      <div className="grid grid-cols-1 gap-x-5 gap-y-3.5 md:grid-cols-2">
        {ro('Sifariş ID', `#${order.id}`)}
        {editable ? (
          <Field label="Status">
            <Select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              options={STATUS_FLOW[order.deliveryMethod].map((s) => ({ value: s, label: orderStatusStyles[s].label }))}
            />
          </Field>
        ) : (
          ro('Status', orderStatusStyles[order.status].label)
        )}
        {ro('Müştəri adı', order.customer)}
        {ro('Telefon', order.phone)}
        {ro('Çatdırılma tipi', deliveryMethodLabels[order.deliveryMethod].long)}
        {ro('Ödəniş tipi', paymentMethodLabels[order.paymentMethod])}
        {ro('Ünvan', order.address)}
        {ro('Çatdırılma haqqı', formatMoney(order.deliveryFee))}
        {ro('Məhsulların cəmi', formatMoney(orderSubtotal(order)))}
        {ro('Yekun məbləğ', formatMoney(orderTotal(order)))}
      </div>
      {isPickup && order.pickup && (
        <Field label="Götürmə məlumatı">
          <Textarea
            disabled
            readOnly
            value={`Götürmə kodu: ${order.pickup.code}  •  Götürmə vaxtı: ${order.pickup.window}  •  Müştəri məhsulu şəxsiyyət vəsiqəsi və sifariş kodu ilə təhvil alır.`}
          />
        </Field>
      )}
      {(!isPickup || editable || note) && (
        <Field label="Qeyd">
          <Textarea
            value={editable ? note : order.note}
            onChange={(e) => onNoteChange(e.target.value)}
            disabled={!editable}
            placeholder={editable ? 'Daxil edin' : '—'}
          />
        </Field>
      )}
    </FormCard>
  )
}

function OrderItems({ order }) {
  const products = useProducts()
  // { ids, clear? } — çıxarılacaq məhsulların productId-ləri
  const [toRemove, setToRemove] = useState(null)
  const [selected, setSelected] = useState(() => new Set())

  const askRemove = (ids, clear) => {
    if (ids.length >= order.items.length) {
      toast('Sifarişdə ən azı bir məhsul qalmalıdır. Sifarişi ləğv etmək üçün statusu "Ləğv edildi" edin.', 'error')
      return
    }
    setToRemove({ ids, clear })
  }

  const removeLabel = () => {
    if (!toRemove) return ''
    if (toRemove.ids.length > 1) return `Seçilmiş ${toRemove.ids.length} məhsul bu sifarişdən çıxarılsın?`
    const item = order.items.find((i) => i.productId === toRemove.ids[0])
    return `"${item?.name}" bu sifarişdən çıxarılsın?`
  }

  const productStatus = (item) => {
    const p = products.find((x) => x.id === item.productId)
    return p ? productStatusStyle(p) : { label: 'Silinib', bg: '#f1f2f5', fg: '#7d8fa8' }
  }

  const cell = (value, medium) => <span className={medium ? 'text-xs font-medium text-heading' : 'text-xs text-heading'}>{value}</span>

  const columns = [
    {
      id: 'image',
      header: 'Şəkil',
      width: 90,
      align: 'center',
      flush: true,
      cell: (i) => (
        <div className="mx-auto h-12 w-[52px] overflow-hidden rounded-lg bg-[#f2f5f7]">
          <img src={i.image} alt="" className="size-full object-cover" />
        </div>
      ),
    },
    { id: 'name', header: 'Məhsul', cell: (i) => cell(i.name, true) },
    { id: 'price', header: 'Qiymət', width: 130, cell: (i) => cell(formatMoney(i.price)) },
    { id: 'quantity', header: 'Say', width: 110, cell: (i) => cell(i.quantity) },
    { id: 'sum', header: 'Cəmi', width: 180, cell: (i) => cell(formatMoney(i.price * i.quantity)) },
    { id: 'status', header: 'Status', width: 140, cell: (i) => <StatusPill status={productStatus(i)} dot /> },
    { id: 'compat', header: 'Uyğunluq', width: 220, cell: (i) => <span className="text-[11px] text-heading">{i.compatibility}</span> },
  ]

  return (
    <div className="flex min-h-full flex-col gap-4 rounded-[9px] bg-white p-4">
      <h2 className="flex h-10 items-center text-base font-semibold text-ink">Sifariş məhsulları</h2>
      <DataTable
        columns={columns}
        rows={order.items}
        rowKey={(i) => i.productId}
        selected={selected}
        onSelectedChange={setSelected}
        actionsWidth={166}
        emptyText="Sifarişdə məhsul yoxdur"
        bulkActions={(ids, clear) => (
          <BulkActionButton onClick={() => askRemove(ids, clear)}>Seçilənləri çıxar</BulkActionButton>
        )}
        actions={(i) => <RowActions onDelete={() => askRemove([i.productId])} />}
      />
      <div className="flex items-baseline justify-end gap-4 pr-1 pt-4">
        <span className="text-xs text-muted">Yekun:</span>
        <span className="text-lg font-semibold text-heading">{formatMoney(orderTotal(order))}</span>
      </div>
      <ConfirmDialog
        open={!!toRemove}
        title="Məhsulu sifarişdən çıxar"
        confirmLabel="Çıxar"
        message={removeLabel()}
        onCancel={() => setToRemove(null)}
        onConfirm={() => {
          ordersStore.update(order.id, { items: order.items.filter((i) => !toRemove.ids.includes(i.productId)) })
          toRemove.clear?.()
          toast(toRemove.ids.length > 1 ? `${toRemove.ids.length} məhsul çıxarıldı` : 'Məhsul sifarişdən çıxarıldı')
          setToRemove(null)
        }}
      />
    </div>
  )
}
