import addButton from '@/assets/icons/add-button.svg'
import chevronDown from '@/assets/icons/chevron-down.svg'
import columnsIcon from '@/assets/icons/columns.svg'
import filterIcon from '@/assets/icons/filter.svg'
import clsx from 'clsx'
import { RotateCw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { countActiveFilters } from '@/lib/filters'
import { Checkbox } from '../Checkbox'
import { FilterDrawer } from '../FilterDrawer'
import { Popover } from '../Popover'

const toolbarButton =
  'flex h-[46px] items-center justify-center gap-2 rounded-[7px] border border-line bg-white px-3.5 text-sm font-medium text-ink transition-colors hover:bg-[#f8fafb]'

export function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  onRefresh,
  columns,
  hiddenColumns,
  onHiddenColumnsChange,
  filters = [],
  filterValues = {},
  onFilterValuesChange,
  onAdd,
  /** Seçilmiş sətir olanda yenilə düyməsinin yerində sil düyməsi göstərilir */
  selectedCount = 0,
  onDeleteSelected,
}) {
  const [spinning, setSpinning] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const activeFilters = countActiveFilters(filterValues)
  const refresh = () => {
    setSpinning(true)
    onRefresh()
    setTimeout(() => setSpinning(false), 600)
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3.5">
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        {onDeleteSelected && selectedCount > 0 ? (
          <button
            type="button"
            onClick={onDeleteSelected}
            aria-label={`Seçilənləri sil (${selectedCount})`}
            className="relative flex h-[46px] w-[66px] shrink-0 items-center justify-center rounded-[7px] bg-[#f2416b] text-white transition-colors hover:bg-[#e0325c]"
          >
            <Trash2 size={18} />
            <span className="absolute -right-2 -top-2 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-white bg-[#ff6b3d] px-1 text-[11px] font-semibold leading-none">
              {selectedCount}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={refresh}
            aria-label="Yenilə"
            className={clsx(toolbarButton, 'w-[66px] shrink-0')}
          >
            <RotateCw size={16} className={clsx(spinning && 'animate-spin')} />
          </button>
        )}
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-[46px] w-full max-w-[320px] min-w-0 rounded-[7px] border border-line bg-white px-3.5 text-sm font-medium text-ink outline-none placeholder:text-ink focus:border-brand"
        />
      </div>

      <div className="flex items-center gap-3.5">
        <Popover
          trigger={({ toggle }) => (
            <button type="button" onClick={toggle} className={clsx(toolbarButton, 'sm:w-[150px]')}>
              <img src={columnsIcon} width={20} height={20} alt="" />
              <span className="hidden sm:inline">Sütunlar</span>
            </button>
          )}
        >
          <p className="px-2 pb-2 pt-1 text-xs font-semibold text-muted">Göstərilən sütunlar</p>
          <div className="flex flex-col gap-1">
            {columns.map((c) => (
              <div key={c.id} className="rounded-md px-2 py-1.5 hover:bg-page">
                <Checkbox
                  checked={!hiddenColumns.has(c.id)}
                  // Ən azı bir sütun görünməlidir
                  disabled={!hiddenColumns.has(c.id) && columns.length - hiddenColumns.size <= 1}
                  label={c.header}
                  onChange={(checked) => {
                    const next = new Set(hiddenColumns)
                    if (checked) next.delete(c.id)
                    else next.add(c.id)
                    onHiddenColumnsChange(next)
                  }}
                />
              </div>
            ))}
          </div>
        </Popover>

        {filters.length > 0 && (
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className={clsx(toolbarButton, 'sm:w-[128px]', activeFilters > 0 && 'border-brand/40')}
          >
            <img src={filterIcon} width={16.25} height={16.25} alt="" />
            <span className="hidden sm:inline">Filtrlər</span>
            {activeFilters > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[10px] text-white">
                {activeFilters}
              </span>
            )}
            <img src={chevronDown} width={10.35} height={5.85} alt="" />
          </button>
        )}
        {filtersOpen && (
          <FilterDrawer
            fields={filters}
            values={filterValues}
            onApply={onFilterValuesChange}
            onClose={() => setFiltersOpen(false)}
          />
        )}

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            aria-label="Əlavə et"
            className="shrink-0 transition-opacity hover:opacity-90"
          >
            <img src={addButton} width={66} height={46} alt="" />
          </button>
        )}
      </div>
    </div>
  )
}
