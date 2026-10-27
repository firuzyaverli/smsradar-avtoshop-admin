import { PageTitle } from '@/components/layout'
import { DataTable, ListToolbar, RowActions, StatusPill } from '@/components/ui'
import { useDeliveries } from '@/data/store'
import { filterRows, inDateRange, optionsFromLabels, uniqueOptions } from '@/lib/filters'
import { formatDateShort } from '@/lib/format'
import { deliveryStatusStyles } from '@/lib/statuses'
import { matchesSearch, useListState } from '@/lib/useListState'
import { Link, useNavigate } from 'react-router'

const text = (value) => <span className="text-xs font-medium text-ink-2">{value}</span>

const columns = [
  {
    id: 'orderId',
    header: 'Sifariş ID',
    width: 120,
    cell: (d) => (
      <Link to={`/orders/${d.orderId}`} className="text-xs font-medium text-ink-2 hover:text-brand hover:underline">
        #{d.orderId}
      </Link>
    ),
  },
  { id: 'customer', header: 'Müştəri', width: 180, cell: (d) => text(d.customer) },
  { id: 'cargo', header: 'Cargo', width: 150, cell: (d) => text(d.cargo) },
  { id: 'trackingId', header: 'Tracking ID', width: 170, cell: (d) => text(d.trackingId) },
  { id: 'address', header: 'Çatdırılma ünvanı', cell: (d) => text(d.address) },
  {
    id: 'status',
    header: 'Cari status',
    width: 160,
    cell: (d) => <StatusPill status={deliveryStatusStyles[d.status]} strong />,
  },
  { id: 'updatedAt', header: 'Son yenilənmə', width: 180, cell: (d) => text(formatDateShort(d.updatedAt)) },
]

export function DeliveriesPage() {
  const navigate = useNavigate()
  const deliveries = useDeliveries()
  const list = useListState()

  const filterFields = [
    {
      id: 'status',
      label: 'Cari status',
      type: 'select',
      options: optionsFromLabels(deliveryStatusStyles),
      match: (d, v) => d.status === v,
    },
    {
      id: 'cargo',
      label: 'Cargo şirkəti',
      type: 'select',
      options: uniqueOptions(deliveries.map((d) => d.cargo)),
      match: (d, v) => d.cargo === v,
    },
    { id: 'updatedAt', label: 'Son yenilənmə', type: 'dateRange', match: (d, v) => inDateRange(d.updatedAt, v) },
  ]

  const rows = filterRows(deliveries, filterFields, list.filters).filter((d) =>
    matchesSearch(list.search, d.orderId, `#${d.orderId}`, d.trackingId, d.customer),
  )

  return (
    <div className="flex flex-col gap-[18px]">
      <PageTitle>Çatdırılmalar</PageTitle>
      <ListToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Sifariş ID / Tracking ID / Müştəri"
        onRefresh={list.reset}
        columns={columns}
        hiddenColumns={list.hiddenColumns}
        onHiddenColumnsChange={list.setHiddenColumns}
        filters={filterFields}
        filterValues={list.filters}
        onFilterValuesChange={list.setFilters}
      />
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(d) => d.id}
        hiddenColumns={list.hiddenColumns}
        selected={list.selected}
        onSelectedChange={list.setSelected}
        resetKey={list.resetKey}
        actionsWidth={146}
        emptyText="Çatdırılma tapılmadı"
        actions={(d) => <RowActions onView={() => navigate(`/deliveries/${d.id}`)} />}
      />
    </div>
  )
}
