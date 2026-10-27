import { DetailPage } from '@/components/layout'
import { Button, Field, Input, StatusPill } from '@/components/ui'
import { useDeliveries, useOrders } from '@/data/store'
import { formatDateShort, formatMoney } from '@/lib/format'
import { deliveryStatusStyles } from '@/lib/statuses'
import { NotFoundPage } from '@/pages/notFound/NotFoundPage'
import clsx from 'clsx'
import { Link, useNavigate, useParams } from 'react-router'

/** Tarixçədə son addımın nöqtə rəngi */
const CURRENT_DOT = { delivered: '#0a8f73', failed: '#c73333' }

export function DeliveryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const delivery = useDeliveries().find((d) => d.id === id)
  const orders = useOrders()
  if (!delivery) return <NotFoundPage title="Çatdırılma tapılmadı" />
  const hasOrder = orders.some((o) => o.id === delivery.orderId)

  const status = deliveryStatusStyles[delivery.status]
  const ro = (label, value) => (
    <Field label={label}>
      <Input value={value} disabled readOnly />
    </Field>
  )

  return (
    <DetailPage
      title="Çatdırılma / Görünüş"
      backTo="/deliveries"
      footer={
        <Button variant="danger" onClick={() => navigate('/deliveries')}>
          Bağla
        </Button>
      }
    >
      <div className="flex flex-col gap-3.5 rounded-[9px] bg-white p-4">
        <div className="flex min-h-[34px] items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-ink-2">Çatdırılma məlumatları</h2>
          <div className="flex items-center gap-3">
            {hasOrder && (
              <Link to={`/orders/${delivery.orderId}`} className="text-xs font-semibold text-brand hover:underline">
                Sifarişə bax →
              </Link>
            )}
            <StatusPill status={status} strong />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ro('Sifariş ID', `#${delivery.orderId}`)}
          {ro('Tracking ID', delivery.trackingId)}
          {ro('Cargo şirkəti', delivery.cargo)}
          {ro('Cari status', status.label)}
          {ro('Müştəri', delivery.customer)}
          {ro('Telefon', delivery.phone)}
          {ro('Çatdırılma haqqı', formatMoney(delivery.fee))}
          {ro('Son yenilənmə', formatDateShort(delivery.updatedAt))}
        </div>
        {ro('Çatdırılma ünvanı', delivery.address)}
        <div className="h-px bg-[#e5e8ed]" />
        <h2 className="text-[15px] font-semibold text-ink-2">Çatdırılma tarixçəsi</h2>
        <ol className="flex flex-col">
          {delivery.history.map((event, i) => {
            const last = i === delivery.history.length - 1
            const dot = last ? (CURRENT_DOT[event.status] ?? '#2973c2') : '#0a8f73'
            return (
              <li key={event.status} className="flex min-h-10 gap-3">
                <div className="relative w-[22px] shrink-0">
                  <span className="absolute left-[6px] top-1 size-2.5 rounded-full" style={{ backgroundColor: dot }} />
                  {!last && <span className="absolute bottom-0 left-[10px] top-[14px] w-0.5 bg-[#d6dee6]" />}
                </div>
                <div className={clsx('flex min-w-0 flex-1 flex-col gap-0.5', !last && 'pb-1')}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold text-ink-2">{deliveryStatusStyles[event.status].label}</span>
                    <span className="shrink-0 text-[11px] font-medium text-[#7a828f]">{formatDateShort(event.at)}</span>
                  </div>
                  <span className="text-[10.5px] font-medium text-[#7a828f]">{event.description}</span>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </DetailPage>
  )
}
