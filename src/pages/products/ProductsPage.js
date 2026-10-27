import { ConfirmDialog, DataTable, ListToolbar, RowActions, StatusPill } from '@/components/ui'
import { productsStore, useCategories, useCompatibilities, useProducts } from '@/data/store'
import { compatibilityLabel, LOW_STOCK_THRESHOLD, productStatusStyle, stockColorClass } from '@/lib/domain'
import { filterRows, inDateRange, inNumberRange, optionsFromLabels, uniqueOptions } from '@/lib/filters'
import { formatDateLong, formatMoney } from '@/lib/format'
import { activeStatusStyles } from '@/lib/statuses'
import { toast } from '@/lib/toast'
import { matchesSearch, useListState } from '@/lib/useListState'
import clsx from 'clsx'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

export function ProductsPage() {
  const navigate = useNavigate()
  const products = useProducts()
  const categories = useCategories()
  const compatibilities = useCompatibilities()
  const list = useListState()
  const [toDelete, setToDelete] = useState(null)
  const [bulkDelete, setBulkDelete] = useState(null)
  const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? '—'
  const compatName = (id) => compatibilityLabel(compatibilities.find((c) => c.id === id))
  const columns = [
    {
      id: 'image',
      header: 'Şəkil',
      width: 90,
      align: 'center',
      flush: true,
      cell: (p) => (
        <div className="mx-auto h-10 w-[45px] overflow-hidden rounded-lg bg-[#f2f5f7]">
          {p.images[0] && (
            <img
              src={p.images[0].url}
              alt=""
              className="size-full object-cover"
              style={{ transform: `rotate(${p.images[0].rotation}deg)` }}
            />
          )}
        </div>
      ),
    },
    {
      id: 'name',
      header: 'Məhsul adı',
      cell: (p) => (
        <Link to={`/products/${p.id}`} className="font-bold text-link hover:underline">
          {p.name}
        </Link>
      ),
    },
    {
      id: 'category',
      header: 'Kateqoriya',
      width: 150,
      cell: (p) => <span className="text-muted">{categoryName(p.categoryId)}</span>,
    },
    {
      id: 'compat',
      header: 'Uyğunluq',
      width: 200,
      cell: (p) => <span className="text-muted">{compatName(p.compatibilityId)}</span>,
    },
    {
      id: 'price',
      header: 'Qiymət',
      width: 120,
      cell: (p) => <span className="font-bold">{formatMoney(p.price)}</span>,
    },
    {
      id: 'stock',
      header: 'Stok',
      width: 110,
      cell: (p) => <span className={clsx('font-bold', stockColorClass(p.stock))}>{p.stock} ədəd</span>,
    },
    { id: 'status', header: 'Status', width: 120, cell: (p) => <StatusPill status={productStatusStyle(p)} dot /> },
    {
      id: 'createdAt',
      header: 'Yaradılma tarixi',
      width: 196,
      cell: (p) => <span className="text-xs text-muted">{formatDateLong(p.createdAt)}</span>,
    },
  ]
  const compatOf = (p) => compatibilities.find((c) => c.id === p.compatibilityId)
  const specific = compatibilities.filter((c) => c.type === 'specific')

  const filterFields = [
    {
      id: 'category',
      label: 'Kateqoriya',
      type: 'select',
      options: categories.map((c) => ({ value: c.id, label: c.name })),
      match: (p, v) => p.categoryId === v,
    },
    {
      id: 'compatType',
      label: 'Uyğunluq tipi',
      type: 'select',
      options: [
        { value: 'universal', label: 'Universal' },
        { value: 'specific', label: 'Spesifik' },
      ],
      match: (p, v) => compatOf(p)?.type === v,
    },
    {
      id: 'brand',
      label: 'Marka',
      type: 'select',
      options: uniqueOptions(specific.map((c) => c.brand)),
      match: (p, v) => compatOf(p)?.brand === v,
    },
    {
      id: 'model',
      label: 'Model',
      type: 'select',
      dependsOn: 'brand',
      dependsOnHint: 'Əvvəl marka seçin',
      options: (draft) => uniqueOptions(specific.filter((c) => c.brand === draft.brand).map((c) => c.model)),
      match: (p, v) => compatOf(p)?.model === v,
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: optionsFromLabels(activeStatusStyles),
      match: (p, v) => p.status === v,
    },
    {
      id: 'stock',
      label: 'Stok vəziyyəti',
      type: 'select',
      options: [
        { value: 'in', label: 'Stokda var' },
        { value: 'low', label: `Az qalıb (${LOW_STOCK_THRESHOLD}-dən az)` },
        { value: 'out', label: 'Stok yoxdur' },
      ],
      match: (p, v) =>
        v === 'out' ? p.stock === 0 : v === 'low' ? p.stock > 0 && p.stock < LOW_STOCK_THRESHOLD : p.stock > 0,
    },
    { id: 'price', label: 'Qiymət (₼)', type: 'numberRange', match: (p, v) => inNumberRange(p.price, v) },
    { id: 'createdAt', label: 'Yaradılma tarixi', type: 'dateRange', match: (p, v) => inDateRange(p.createdAt, v) },
  ]

  const rows = filterRows(products, filterFields, list.filters).filter((p) => matchesSearch(list.search, p.name, p.id))
  return (
    <div className="flex flex-col gap-[18px]">
      <ListToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Məhsul adı / ID"
        onRefresh={list.reset}
        columns={columns}
        hiddenColumns={list.hiddenColumns}
        onHiddenColumnsChange={list.setHiddenColumns}
        filters={filterFields}
        filterValues={list.filters}
        onFilterValuesChange={list.setFilters}
        selectedCount={list.selectedIn(rows).length}
        onDeleteSelected={() => setBulkDelete({ ids: list.selectedIn(rows), clear: list.clearSelection })}
        onAdd={() => navigate('/products/new')}
      />
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(p) => p.id}
        hiddenColumns={list.hiddenColumns}
        selected={list.selected}
        onSelectedChange={list.setSelected}
        resetKey={list.resetKey}
        emptyText="Məhsul tapılmadı"
        actions={(p) => (
          <RowActions
            onView={() => navigate(`/products/${p.id}`)}
            onEdit={() => navigate(`/products/${p.id}?tab=general`)}
            onDelete={() => setToDelete(p)}
          />
        )}
      />
      <ConfirmDialog
        open={!!toDelete}
        message={`"${toDelete?.name}" məhsulu silinsin? Bu əməliyyatı geri qaytarmaq olmaz.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) productsStore.remove(toDelete.id)
          setToDelete(null)
          toast('Məhsul silindi')
        }}
      />
      <ConfirmDialog
        open={!!bulkDelete}
        message={`Seçilmiş ${bulkDelete?.ids.length} məhsul silinsin? Bu əməliyyatı geri qaytarmaq olmaz.`}
        onCancel={() => setBulkDelete(null)}
        onConfirm={() => {
          bulkDelete.ids.forEach((id) => productsStore.remove(id))
          bulkDelete.clear()
          toast(`${bulkDelete.ids.length} məhsul silindi`)
          setBulkDelete(null)
        }}
      />
    </div>
  )
}
