import { PageTitle } from '@/components/layout'
import { ConfirmDialog, DataTable, ListToolbar, RowActions, StatusPill } from '@/components/ui'
import { deliveriesStore, ordersStore, useOrders } from '@/data/store'
import { orderTotal } from '@/lib/domain'
import { filterRows, inDateRange, inNumberRange, optionsFromLabels } from '@/lib/filters'
import { formatDateLong, formatMoney } from '@/lib/format'
import { deliveryMethodLabels, orderStatusStyles, paymentMethodLabels } from '@/lib/statuses'
import { toast } from '@/lib/toast'
import { matchesSearch, useListState } from '@/lib/useListState'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

const text = (value) => <span className="text-xs text-heading">{value}</span>

const columns = [
  {
    id: 'id',
    header: 'Sifariş ID',
    width: 130,
    align: 'center',
    cell: (o) => <span className="text-xs font-medium text-heading">#{o.id}</span>,
  },
  { id: 'customer', header: 'Müştəri', width: 245, cell: (o) => text(o.customer) },
  { id: 'phone', header: 'Telefon', width: 175, cell: (o) => text(o.phone) },
  { id: 'total', header: 'Məbləğ', width: 130, cell: (o) => text(formatMoney(orderTotal(o))) },
  { id: 'delivery', header: 'Çatdırılma', width: 155, cell: (o) => text(deliveryMethodLabels[o.deliveryMethod].short) },
  { id: 'payment', header: 'Ödəniş', width: 155, cell: (o) => text(paymentMethodLabels[o.paymentMethod]) },
  { id: 'status', header: 'Status', width: 155, cell: (o) => <StatusPill status={orderStatusStyles[o.status]} /> },
  { id: 'createdAt', header: 'Yaradılma tarixi', cell: (o) => text(formatDateLong(o.createdAt)) },
]

const filterFields = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: optionsFromLabels(orderStatusStyles),
    match: (o, v) => o.status === v,
  },
  {
    id: 'delivery',
    label: 'Çatdırılma tipi',
    type: 'select',
    options: Object.entries(deliveryMethodLabels).map(([value, l]) => ({ value, label: l.long })),
    match: (o, v) => o.deliveryMethod === v,
  },
  {
    id: 'payment',
    label: 'Ödəniş tipi',
    type: 'select',
    options: optionsFromLabels(paymentMethodLabels),
    match: (o, v) => o.paymentMethod === v,
  },
  { id: 'total', label: 'Məbləğ (₼)', type: 'numberRange', match: (o, v) => inNumberRange(orderTotal(o), v) },
  { id: 'createdAt', label: 'Yaradılma tarixi', type: 'dateRange', match: (o, v) => inDateRange(o.createdAt, v) },
]

export function OrdersPage() {
  const navigate = useNavigate()
  const orders = useOrders()
  const list = useListState()
  const [toDelete, setToDelete] = useState(null)
  const [bulkDelete, setBulkDelete] = useState(null)

  // Cargo-ya ötürülmüş sifariş silinə bilməz — çatdırılma qeydi sahibsiz qalardı
  const hasDelivery = (orderId) => deliveriesStore.getAll().some((d) => d.orderId === orderId)

  const remove = (order) => {
    if (hasDelivery(order.id)) {
      toast(`#${order.id} cargo-ya ötürülüb — onu silmək olmaz`, 'error')
      return
    }
    setToDelete(order)
  }

  const removeMany = (ids, clear) => {
    const deletable = ids.filter((id) => !hasDelivery(id))
    if (!deletable.length) {
      toast('Seçilən sifarişlərin hamısı cargo-ya ötürülüb — silmək olmaz', 'error')
      return
    }
    setBulkDelete({ ids: deletable, skipped: ids.length - deletable.length, clear })
  }

  const rows = useMemo(
    () =>
      filterRows(orders, filterFields, list.filters).filter((o) =>
        matchesSearch(list.search, o.id, `#${o.id}`, o.customer, o.phone, o.phone.replace(/\s/g, '')),
      ),
    [orders, list.search, list.filters],
  )

  return (
    <div className="flex flex-col gap-[18px]">
      <PageTitle>Sifarişlər</PageTitle>
      <ListToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Sifariş ID / Müştəri / Telefon"
        onRefresh={list.reset}
        columns={columns}
        hiddenColumns={list.hiddenColumns}
        onHiddenColumnsChange={list.setHiddenColumns}
        filters={filterFields}
        filterValues={list.filters}
        onFilterValuesChange={list.setFilters}
        selectedCount={list.selectedIn(rows).length}
        onDeleteSelected={() => removeMany(list.selectedIn(rows), list.clearSelection)}
      />
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(o) => o.id}
        hiddenColumns={list.hiddenColumns}
        selected={list.selected}
        onSelectedChange={list.setSelected}
        resetKey={list.resetKey}
        emptyText="Sifariş tapılmadı"
        actions={(o) => (
          <RowActions
            onView={() => navigate(`/orders/${o.id}`)}
            onEdit={() => navigate(`/orders/${o.id}?tab=status`)}
            onDelete={() => remove(o)}
          />
        )}
      />
      <ConfirmDialog
        open={!!bulkDelete}
        message={
          `Seçilmiş ${bulkDelete?.ids.length} sifariş silinsin?` +
          (bulkDelete?.skipped ? ` Cargo-ya ötürülmüş ${bulkDelete.skipped} sifariş silinməyəcək.` : '')
        }
        onCancel={() => setBulkDelete(null)}
        onConfirm={() => {
          bulkDelete.ids.forEach((id) => ordersStore.remove(id))
          bulkDelete.clear()
          toast(`${bulkDelete.ids.length} sifariş silindi`)
          setBulkDelete(null)
        }}
      />
      <ConfirmDialog
        open={!!toDelete}
        message={`#${toDelete?.id} sifarişi silinsin? Bu əməliyyatı geri qaytarmaq olmaz.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) ordersStore.remove(toDelete.id)
          setToDelete(null)
          toast('Sifariş silindi')
        }}
      />
    </div>
  )
}
