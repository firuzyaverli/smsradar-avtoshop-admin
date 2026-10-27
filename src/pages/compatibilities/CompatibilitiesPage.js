import {
  Button,
  ConfirmDialog,
  DataTable,
  Field,
  Input,
  ListToolbar,
  Modal,
  RowActions,
  Select,
  StatusField,
  StatusPill,
  Tabs,
} from '@/components/ui'
import { brands, carCatalog, years } from '@/data/carCatalog'
import { compatibilitiesStore, newId, productsStore, useCompatibilities } from '@/data/store'
import { filterRows, optionsFromLabels } from '@/lib/filters'
import { formatYearRange } from '@/lib/format'
import { activeStatusStyles } from '@/lib/statuses'
import { toast } from '@/lib/toast'
import { matchesSearch, useListState } from '@/lib/useListState'
import { useMemo, useState } from 'react'

const TYPE_LABELS = { universal: 'Universal', specific: 'Spesifik' }

const MODAL_TABS = [
  { key: 'general', label: 'Ümumi' },
  { key: 'view', label: 'Görünüş' },
]

const text = (value) => <span className="text-xs text-heading">{value}</span>

const columns = [
  { id: 'name', header: 'Uyğunluq adı', width: 300, cell: (c) => text(c.name) },
  { id: 'type', header: 'Tip', width: 150, cell: (c) => text(TYPE_LABELS[c.type]) },
  {
    id: 'brandModel',
    header: 'Marka / Model',
    cell: (c) => text(c.type === 'specific' ? `${c.brand} / ${c.model}` : '—'),
  },
  { id: 'years', header: 'İl aralığı', width: 190, cell: (c) => text(formatYearRange(c.yearFrom, c.yearTo)) },
  { id: 'status', header: 'Status', width: 180, cell: (c) => <StatusPill status={activeStatusStyles[c.status]} /> },
]

const filterFields = [
  { id: 'type', label: 'Tip', type: 'select', options: optionsFromLabels(TYPE_LABELS), match: (c, v) => c.type === v },
  {
    id: 'brand',
    label: 'Marka',
    type: 'select',
    options: brands.map((b) => ({ value: b, label: b })),
    match: (c, v) => c.brand === v,
  },
  {
    id: 'model',
    label: 'Model',
    type: 'select',
    dependsOn: 'brand',
    dependsOnHint: 'Əvvəl marka seçin',
    options: (draft) => (carCatalog[draft.brand] ?? []).map((m) => ({ value: m, label: m })),
    match: (c, v) => c.model === v,
  },
  {
    id: 'year',
    label: 'Avtomobil ili',
    type: 'select',
    options: years.map((y) => ({ value: String(y), label: String(y) })),
    // Universal uyğunluq bütün illərə uyğundur
    match: (c, v) => c.type === 'universal' || (c.yearFrom <= Number(v) && Number(v) <= c.yearTo),
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: optionsFromLabels(activeStatusStyles),
    match: (c, v) => c.status === v,
  },
]

export function CompatibilitiesPage() {
  const compatibilities = useCompatibilities()
  const list = useListState()
  const [modal, setModal] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const rows = useMemo(
    () =>
      filterRows(compatibilities, filterFields, list.filters).filter((c) =>
        matchesSearch(list.search, c.name, c.id, c.brand, c.model),
      ),
    [compatibilities, list.search, list.filters],
  )

  const isUsed = (compatId) => productsStore.getAll().some((p) => p.compatibilityId === compatId)

  const remove = (compat) => {
    if (isUsed(compat.id)) {
      toast('Bu uyğunluq məhsullarda istifadə olunur — əvvəlcə məhsulları dəyişin', 'error')
      return
    }
    setToDelete({ ids: [compat.id], label: `"${compat.name}" uyğunluğu silinsin?` })
  }

  const removeMany = (ids, clear) => {
    const deletable = ids.filter((id) => !isUsed(id))
    if (!deletable.length) {
      toast('Seçilən uyğunluqların hamısı məhsullarda istifadə olunur — silmək olmaz', 'error')
      return
    }
    const skipped = ids.length - deletable.length
    setToDelete({
      ids: deletable,
      clear,
      label:
        `Seçilmiş ${deletable.length} uyğunluq silinsin?` +
        (skipped ? ` Məhsullarda istifadə olunan ${skipped} uyğunluq silinməyəcək.` : ''),
    })
  }

  return (
    <div className="flex flex-col gap-[18px]">
      <ListToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Uyğunluq adı / ID"
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
        actionsWidth={276}
        emptyText="Uyğunluq tapılmadı"
        actions={(c) => (
          <RowActions
            onView={() => setModal({ mode: 'view', compat: c })}
            onEdit={() => setModal({ mode: 'edit', compat: c })}
            onDelete={() => remove(c)}
          />
        )}
      />
      {modal && (
        <CompatibilityModal
          key={modal.compat?.id ?? 'new'}
          compat={modal.compat}
          initialTab={modal.mode === 'view' ? 'view' : 'general'}
          onClose={() => setModal(null)}
        />
      )}
      <ConfirmDialog
        open={!!toDelete}
        message={toDelete?.label}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          toDelete.ids.forEach((id) => compatibilitiesStore.remove(id))
          toDelete.clear?.()
          toast(toDelete.ids.length > 1 ? `${toDelete.ids.length} uyğunluq silindi` : 'Uyğunluq silindi')
          setToDelete(null)
        }}
      />
    </div>
  )
}

function validate(form, currentId) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Uyğunluq adını daxil edin'
  if (!form.type) errors.type = 'Tip seçin'
  if (form.type === 'specific') {
    if (!form.brand) errors.brand = 'Marka seçin'
    if (!form.model) errors.model = 'Model seçin'
    if (!form.yearFrom) errors.yearFrom = 'Başlanğıc il seçin'
    if (!form.yearTo) errors.yearTo = 'Son il seçin'
    if (form.yearFrom && form.yearTo && Number(form.yearFrom) > Number(form.yearTo))
      errors.yearTo = 'Son il başlanğıc ildən kiçik ola bilməz'
  }
  if (Object.keys(errors).length) return errors

  // Təkrar qeydlərin qarşısını al: bir "Universal", eyni marka/model/il aralığı isə bir dəfə
  const others = compatibilitiesStore.getAll().filter((c) => c.id !== currentId)
  if (form.type === 'universal' && others.some((c) => c.type === 'universal'))
    errors.type = '"Universal" uyğunluq artıq mövcuddur'
  if (
    form.type === 'specific' &&
    others.some(
      (c) =>
        c.brand === form.brand &&
        c.model === form.model &&
        c.yearFrom === Number(form.yearFrom) &&
        c.yearTo === Number(form.yearTo),
    )
  )
    errors.model = 'Bu marka, model və il aralığı üçün uyğunluq artıq var'
  return errors
}

/** Ad boşdursa və ya əvvəlki avtomatik addırsa, marka/modeldən yenidən yaradılır */
const autoName = (brand, model) => [brand, model].filter(Boolean).join(' ')

function CompatibilityModal({ compat, initialTab, onClose }) {
  const [tab, setTab] = useState(initialTab)
  const [form, setForm] = useState(() => ({
    name: compat?.name ?? '',
    type: compat?.type ?? '',
    brand: compat?.brand ?? '',
    model: compat?.model ?? '',
    yearFrom: compat?.yearFrom ? String(compat.yearFrom) : '',
    yearTo: compat?.yearTo ? String(compat.yearTo) : '',
    active: compat ? compat.status === 'active' : true,
  }))
  const [errors, setErrors] = useState({})
  const readOnly = tab === 'view'
  const specificDisabled = readOnly || form.type !== 'specific'

  const set = (patch) => {
    setForm((f) => ({ ...f, ...patch }))
    setErrors((e) => ({ ...e, ...Object.fromEntries(Object.keys(patch).map((k) => [k, undefined])) }))
  }

  const save = () => {
    const found = validate(form, compat?.id)
    setErrors(found)
    if (Object.keys(found).length) {
      setTab('general')
      return
    }
    const specific = form.type === 'specific'
    const data = {
      name: form.name.trim(),
      type: form.type,
      brand: specific ? form.brand : null,
      model: specific ? form.model : null,
      yearFrom: specific ? Number(form.yearFrom) : null,
      yearTo: specific ? Number(form.yearTo) : null,
      status: form.active ? 'active' : 'inactive',
    }
    if (compat) {
      compatibilitiesStore.update(compat.id, data)
      toast('Uyğunluq yeniləndi')
    } else {
      compatibilitiesStore.create({ id: newId('cmp'), createdAt: new Date().toISOString(), ...data })
      toast('Uyğunluq əlavə edildi')
    }
    onClose()
  }

  // Universal seçiləndə marka/model/il təmizlənir; marka dəyişəndə model sıfırlanır
  const followsAuto =
    !form.name.trim() || form.name.trim() === autoName(form.brand, form.model) || form.name.trim() === 'Universal'
  const changeType = (type) =>
    set(
      type === 'universal'
        ? { type, brand: '', model: '', yearFrom: '', yearTo: '', ...(followsAuto && { name: 'Universal' }) }
        : { type, ...(followsAuto && form.name.trim() === 'Universal' && { name: '' }) },
    )

  const changeBrand = (brand) => set({ brand, model: '', ...(followsAuto && { name: autoName(brand, '') }) })
  const changeModel = (model) => set({ model, ...(followsAuto && { name: autoName(form.brand, model) }) })

  const yearOptions = years.map((y) => ({ value: String(y), label: String(y) }))
  const title = !compat ? 'Uyğunluq əlavə et' : readOnly ? 'Uyğunluq məlumatı' : 'Uyğunluğu redaktə et'

  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      width={660}
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
      <div className="flex flex-col gap-3 px-6 py-3.5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Uyğunluq adı" error={errors.name}>
            <Input
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              disabled={readOnly}
              aria-invalid={!!errors.name}
            />
          </Field>
          <Field label="Tip" error={errors.type}>
            <Select
              value={form.type}
              onChange={(e) => changeType(e.target.value)}
              disabled={readOnly}
              required
              aria-invalid={!!errors.type}
              options={Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label }))}
            />
          </Field>
          <Field label="Marka" error={errors.brand}>
            <Select
              value={form.brand}
              onChange={(e) => changeBrand(e.target.value)}
              disabled={specificDisabled}
              required
              aria-invalid={!!errors.brand}
              options={brands.map((b) => ({ value: b, label: b }))}
            />
          </Field>
          <Field label="Model" error={errors.model}>
            <Select
              value={form.model}
              onChange={(e) => changeModel(e.target.value)}
              disabled={specificDisabled || !form.brand}
              required
              placeholder={form.brand ? 'Seçin' : 'Əvvəl marka seçin'}
              aria-invalid={!!errors.model}
              options={(carCatalog[form.brand] ?? []).map((m) => ({ value: m, label: m }))}
            />
          </Field>
          <Field label="Başlanğıc il" error={errors.yearFrom}>
            <Select
              value={form.yearFrom}
              onChange={(e) => set({ yearFrom: e.target.value })}
              disabled={specificDisabled}
              required
              aria-invalid={!!errors.yearFrom}
              options={yearOptions}
            />
          </Field>
          <Field label="Son il" error={errors.yearTo}>
            <Select
              value={form.yearTo}
              onChange={(e) => set({ yearTo: e.target.value })}
              disabled={specificDisabled}
              required
              aria-invalid={!!errors.yearTo}
              options={yearOptions}
            />
          </Field>
        </div>
        <StatusField checked={form.active} onChange={(active) => set({ active })} disabled={readOnly} />
        <p className="text-[10.5px] font-medium text-[#7a828f]">
          Tip “Universal” seçildikdə Marka, Model və İl sahələri deaktiv olur.
        </p>
      </div>
    </Modal>
  )
}
