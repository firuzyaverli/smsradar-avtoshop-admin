import deleteIcon from '@/assets/icons/action-delete.svg'
import editIcon from '@/assets/icons/action-edit.svg'
import infoIcon from '@/assets/icons/action-info.svg'

/** Cədvəldəki "Fəaliyyət" sütunu: bax / redaktə et / sil */
export function RowActions({ onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      {onView && (
        <button type="button" title="Bax" aria-label="Bax" onClick={onView} className="rounded p-0.5 hover:bg-page">
          <img src={infoIcon} width={20} height={20} alt="" />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          title="Redaktə et"
          aria-label="Redaktə et"
          onClick={onEdit}
          className="rounded p-0.5 hover:bg-page"
        >
          <img src={editIcon} width={20} height={20} alt="" />
        </button>
      )}
      {onDelete && (
        <button type="button" title="Sil" aria-label="Sil" onClick={onDelete} className="rounded hover:bg-page">
          <img src={deleteIcon} width={24} height={24} alt="" />
        </button>
      )}
    </div>
  )
}
