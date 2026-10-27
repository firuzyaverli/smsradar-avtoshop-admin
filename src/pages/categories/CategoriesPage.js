import {
  Button,
  ConfirmDialog,
  DataTable,
  Field,
  Input,
  ListToolbar,
  Modal,
  RowActions,
  StatusField,
  StatusPill,
  Tabs,
} from '@/components/ui'
import { categoriesStore, newId, productsStore, useCategories } from '@/data/store'
import { filterRows, inDateRange, optionsFromLabels } from '@/lib/filters'
import { formatDateLong } from '@/lib/format'
import { activeStatusStyles } from '@/lib/statuses'
import { toast } from '@/lib/toast'
import { matchesSearch, useListState } from '@/lib/useListState'
import { useMemo, useState } from 'react'

const MODAL_TABS = [
  { key: 'general', label: 'Ümumi' },
  { key: 'view', label: 'Görünüş' },
]

const filterFields = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: optionsFromLabels(activeStatusStyles),
    match: (c, v) => c.status === v,
  },
  { id: 'createdAt', label: 'Yaradılma tarixi', type: 'dateRange', match: (c, v) => inDateRange(c.createdAt, v) },
]

const columns = [
  { id: 'name', header: 'Kateqoriya adı', cell: (c) => <span className="text-xs text-heading">{c.name}</span> },
  { id: 'status', header: 'Status', width: 180, cell: (c) => <StatusPill status={activeStatusStyles[c.status]} /> },
  {
    id: 'createdAt',
    header: 'Yaradılma tarixi',
    width: 376,
    cell: (c) => <span className="text-xs text-heading">{formatDateLong(c.createdAt)}</span>,
  },
]

export function CategoriesPage() {
  const categories = useCategories()
  const list = useListState()
  // { mode: 'create' | 'edit' | 'view', category? }
  const [modal, setModal] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const rows = useMemo(
    () =>
      filterRows(categories, filterFields, list.filters).filter((c) => matchesSearch(list.search, c.name, c.id)),
    [categories, list.search, list.filters],
  )

  const isUsed = (categoryId) => productsStore.getAll().some((p) => p.categoryId === categoryId)

  const remove = (category) => {
    if (isUsed(category.id)) {
      toast('Bu kateqoriyada məhsul var — əvvəlcə məhsulları başqa kateqoriyaya keçirin', 'error')
      return
    }
    setToDelete({ ids: [category.id], label: `"${category.name}" kateqoriyası silinsin?` })
  }

  const removeMany = (ids, clear) => {
    const deletable = ids.filter((id) => !isUsed(id))
    if (!deletable.length) {
      toast('Seçilən kateqoriyaların hamısında məhsul var — silmək olmaz', 'error')
      return
    }
    const skipped = ids.length - deletable.length
    setToDelete({
      ids: deletable,
      clear,
      label:
        `Seçilmiş ${deletable.length} kateqoriya silinsin?` +
        (skipped ? ` İçində məhsul olan ${skipped} kateqoriya silinməyəcək.` : ''),
    })
  }

  return (
    <div className="flex flex-col gap-[18px]">
      <ListToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Kateqoriya adı / ID"
        onRefresh={list.reset}
        columns={columns}
        hiddenColumns={list.hiddenColumns}
        onHiddenColumnsChange={list.setHiddenColumns}
        filters={filterFields}
        filterValues={list.filters}
        onFilterValuesChange={list.setFilters}
        selectedCount={list.selectedIn(rows).length}
        onDeleteSelected={() => removeMany(list.selectedIn(rows), list.clearSelection)}
        onAdd={() => setModal({ mode: 'create' })}
      />
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(c) => c.id}
        hiddenColumns={list.hiddenColumns}
        selected={list.selected}
        onSelectedChange={list.setSelected}
        resetKey={list.resetKey}
        actionsWidth={220}
        emptyText="Kateqoriya tapılmadı"
        actions={(c) => (
          <RowActions
            onView={() => setModal({ mode: 'view', category: c })}
            onEdit={() => setModal({ mode: 'edit', category: c })}
            onDelete={() => remove(c)}
          />
        )}
      />
      {modal && (
        <CategoryModal
          key={modal.category?.id ?? 'new'}
          initialTab={modal.mode === 'view' ? 'view' : 'general'}
          category={modal.category}
          onClose={() => setModal(null)}
        />
      )}
      <ConfirmDialog
        open={!!toDelete}
        message={toDelete?.label}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          toDelete.ids.forEach((id) => categoriesStore.remove(id))
          toDelete.clear?.()
          toast(toDelete.ids.length > 1 ? `${toDelete.ids.length} kateqoriya silindi` : 'Kateqoriya silindi')
          setToDelete(null)
        }}
      />
    </div>
  )
}

function CategoryModal({ category, initialTab, onClose }) {
  const [tab, setTab] = useState(initialTab)
  const [name, setName] = useState(category?.name ?? '')
  const [active, setActive] = useState(category ? category.status === 'active' : true)
  const [error, setError] = useState('')
  const readOnly = tab === 'view'

  const save = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setTab('general')
      setError('Kateqoriya adını daxil edin')
      return
    }
    const duplicate = categoriesStore
      .getAll()
      .some((c) => c.id !== category?.id && c.name.toLocaleLowerCase('az') === trimmed.toLocaleLowerCase('az'))
    if (duplicate) {
      setTab('general')
      setError('Bu adda kateqoriya artıq var')
      return
    }
    const data = { name: trimmed, status: active ? 'active' : 'inactive' }
    if (category) {
      categoriesStore.update(category.id, data)
      toast('Kateqoriya yeniləndi')
    } else {
      categoriesStore.create({ id: newId('cat'), createdAt: new Date().toISOString(), ...data })
      toast('Kateqoriya əlavə edildi')
    }
    onClose()
  }

  const title = !category ? 'Kateqoriya əlavə et' : readOnly ? 'Kateqoriya məlumatı' : 'Kateqoriyanı redaktə et'

  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      footer={
        <>
          {!readOnly && <Button onClick={save}>Yadda saxla</Button>}
          <Button variant="danger" onClick={onClose}>
            Bağla
          </Button>
        </>
      }
    >
      <Tabs compact tabs={MODAL_TABS} active={tab} onChange={setTab} />
      <form
        className="flex flex-col gap-3 px-[18px] py-3.5"
        onSubmit={(e) => {
          e.preventDefault()
          if (!readOnly) save()
        }}
      >
        <Field label="Kateqoriya adı" error={error}>
          <Input
            autoFocus={!readOnly}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            disabled={readOnly}
            aria-invalid={!!error}
          />
        </Field>
        <StatusField checked={active} onChange={setActive} disabled={readOnly} />
      </form>
    </Modal>
  )
}
