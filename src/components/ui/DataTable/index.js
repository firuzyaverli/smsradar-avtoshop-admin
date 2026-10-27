import clsx from 'clsx'
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Checkbox } from '../Checkbox'

// Sütun: { id, header, width?, align?: 'center', flush?: true (şəkil üçün şaquli padding yoxdur), cell(row) }
// width verilməyən sütun boş qalan eni tutur
const GROW_MIN_WIDTH = 160

/** Seçim panelindəki düymə (məs. "Seçilənləri sil") */
export function BulkActionButton({ onClick, children, danger = true }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-md px-2.5 py-1 font-semibold transition-colors',
        danger ? 'text-danger-text hover:bg-[#fcf0f0]' : 'text-brand hover:bg-white',
      )}
    >
      {children}
    </button>
  )
}

export function DataTable({
  columns,
  rows,
  rowKey,
  hiddenColumns,
  selected,
  onSelectedChange,
  actions,
  actionsWidth = 110,
  pageSize = 10,
  emptyText = 'Heç nə tapılmadı',
  /** Seçilmiş sətirlər üçün düymələr: (ids, clear) => ReactNode */
  bulkActions,
  /** Dəyişəndə 1-ci səhifəyə qayıdır (məs. axtarış + filtrlər) */
  resetKey,
}) {
  const visible = columns.filter((c) => !hiddenColumns?.has(c.id))
  const [requestedPage, setPage] = useState(0)
  const [prevResetKey, setPrevResetKey] = useState(resetKey)
  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey)
    setPage(0)
  }
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  // Axtarış/filtr nəticəsi azalanda mövcud olmayan səhifədə qalmamaq üçün
  const page = Math.min(requestedPage, pageCount - 1)

  const pageRows = useMemo(() => rows.slice(page * pageSize, (page + 1) * pageSize), [rows, page, pageSize])
  const selectable = !!selected && !!onSelectedChange
  // Silinmiş və ya filtrdən kənarda qalan sətirlər seçimə daxil edilmir
  const selectedIds = selectable ? rows.map(rowKey).filter((id) => selected.has(id)) : []
  const clearSelection = () => onSelectedChange?.(new Set())
  const pageIds = pageRows.map(rowKey)
  const allChecked = selectable && pageIds.length > 0 && pageIds.every((id) => selected.has(id))
  const toggleAll = (checked) => {
    if (!onSelectedChange || !selected) return
    const next = new Set(selected)
    pageIds.forEach((id) => (checked ? next.add(id) : next.delete(id)))
    onSelectedChange(next)
  }
  const toggleOne = (id, checked) => {
    if (!onSelectedChange || !selected) return
    const next = new Set(selected)
    if (checked) next.add(id)
    else next.delete(id)
    onSelectedChange(next)
  }
  const minWidth =
    (selectable ? 42 : 0) +
    visible.reduce((sum, c) => sum + (c.width ?? GROW_MIN_WIDTH), 0) +
    (actions ? actionsWidth : 0)
  const headCell = 'h-[58px] border-b border-r border-line pl-3 pr-2 text-[11.5px] font-bold uppercase text-ink'
  const bodyCell = 'h-[50px] border-b border-r border-line-row px-2.5'
  const actionsCell = 'sticky right-0 border-x-[1.5px] border-line-strong text-center'
  const align = (c) => (c.align === 'center' ? 'text-center' : 'text-left')
  return (
    <div className="overflow-hidden rounded-lg border border-line-strong bg-white">
      {/* Seçim zolağı yalnız bulkActions verilən cədvəllərdə (siyahı səhifələrində silmə toolbar-dadır) */}
      {bulkActions && selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-b border-line bg-brand-soft px-4 py-2.5 text-xs">
          <span className="font-semibold text-brand">{selectedIds.length} sətir seçildi</span>
          {bulkActions?.(selectedIds, clearSelection)}
          <button type="button" onClick={clearSelection} className="ml-auto font-medium text-muted hover:text-ink">
            Seçimi ləğv et
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-separate border-spacing-0" style={{ minWidth }}>
          <colgroup>
            {selectable && <col style={{ width: 42 }} />}
            {visible.map((c) => (
              <col key={c.id} style={c.width ? { width: c.width } : undefined} />
            ))}
            {actions && <col style={{ width: actionsWidth }} />}
          </colgroup>
          <thead>
            <tr>
              {selectable && (
                <th className={clsx(headCell, 'text-left')}>
                  <Checkbox
                    // Yalnız hamısı seçiləndə işarələnir — qismən seçimdə "–" göstərilmir
                    checked={allChecked}
                    onChange={toggleAll}
                    ariaLabel="Hamısını seç"
                  />
                </th>
              )}
              {visible.map((c) => (
                <th key={c.id} className={clsx(headCell, align(c), c.align === 'center' && 'pl-2')}>
                  {c.header}
                </th>
              ))}
              {actions && <th className={clsx(headCell, actionsCell, 'bg-white pl-0 pr-0')}>Fəaliyyət</th>}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => {
              const id = rowKey(row)
              const isSelected = selectable && selected.has(id)
              // Seçilən sətir: açıq mavi fon + solda mavi xətt
              const bg = isSelected ? 'bg-[#e8f5fd]' : i % 2 === 1 ? 'bg-row-alt' : 'bg-white'
              const hoverBg = isSelected ? 'group-hover:bg-[#dff0fb]' : 'group-hover:bg-[#f5f8fa]'
              return (
                <tr key={id} className={clsx(bg, 'group transition-colors', isSelected ? 'hover:bg-[#dff0fb]' : 'hover:bg-[#f5f8fa]')}>
                  {selectable && (
                    <td className={clsx(bodyCell, 'py-1.5', isSelected && 'shadow-[inset_3px_0_0_#1ea7e4]')}>
                      <Checkbox checked={selected.has(id)} onChange={(c) => toggleOne(id, c)} ariaLabel="Sətri seç" />
                    </td>
                  )}
                  {visible.map((c) => (
                    <td
                      key={c.id}
                      className={clsx(bodyCell, 'truncate text-sm', align(c), c.flush ? 'py-0' : 'py-1.5')}
                    >
                      {c.cell(row)}
                    </td>
                  ))}
                  {actions && (
                    <td className={clsx(bodyCell, actionsCell, bg, hoverBg, 'py-1.5 transition-colors')}>
                      {actions(row)}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-muted">
            <Inbox size={32} strokeWidth={1.5} />
            <p className="text-sm">{emptyText}</p>
          </div>
        )}
      </div>
      {rows.length > pageSize && (
        <div className="flex items-center justify-end gap-3 px-4 py-3 text-xs text-muted">
          <span>
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, rows.length)} / {rows.length}
          </span>
          <button
            type="button"
            aria-label="Əvvəlki səhifə"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="rounded-md border border-line p-1 text-ink disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Növbəti səhifə"
            disabled={page >= pageCount - 1}
            onClick={() => setPage(page + 1)}
            className="rounded-md border border-line p-1 text-ink disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
