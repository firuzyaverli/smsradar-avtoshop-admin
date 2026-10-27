import { useState } from 'react'

/** Siyahı səhifələrinin ortaq vəziyyəti: axtarış, gizli sütunlar, filtrlər, seçilmiş sətirlər. */
export function useListState() {
  const [search, setSearch] = useState('')
  const [hiddenColumns, setHiddenColumns] = useState(() => new Set())
  const [filters, setFilters] = useState({})
  const [selected, setSelected] = useState(() => new Set())
  const reset = () => {
    setSearch('')
    setFilters({})
    setSelected(new Set())
  }
  const clearSelection = () => setSelected(new Set())
  // DataTable kimi: yalnız cədvəldə görünən (silinməmiş, filtrdən keçən) seçilmiş sətirlər
  const selectedIn = (rows, key = (r) => r.id) => rows.map(key).filter((id) => selected.has(id))
  // DataTable-a ötürülür: axtarış/filtr dəyişəndə cədvəl 1-ci səhifəyə qayıdır
  const resetKey = `${search}|${JSON.stringify(filters)}`
  return {
    search,
    setSearch,
    hiddenColumns,
    setHiddenColumns,
    filters,
    setFilters,
    selected,
    setSelected,
    clearSelection,
    selectedIn,
    reset,
    resetKey,
  }
}

/** Azərbaycan hərflərini nəzərə alan, böyük/kiçik hərfə həssas olmayan axtarış */
export function matchesSearch(query, ...values) {
  const q = query.trim().toLocaleLowerCase('az')
  if (!q) return true
  return values.some((v) => v != null && String(v).toLocaleLowerCase('az').includes(q))
}
