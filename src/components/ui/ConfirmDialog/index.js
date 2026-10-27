import { Button } from '../Button'
import { Modal } from '../Modal'

export function ConfirmDialog({
  open,
  title = 'Silməni təsdiqləyin',
  message,
  confirmLabel = 'Sil',
  cancelLabel = 'Ləğv et',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      width={420}
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="px-[18px] pb-5 pt-1 text-sm text-ink-2">{message}</p>
    </Modal>
  )
}

/** useUnsavedChanges-dən gələn blocker üçün təsdiq pəncərəsi */
export function UnsavedChangesDialog({ blocker }) {
  return (
    <ConfirmDialog
      open={blocker.state === 'blocked'}
      title="Yadda saxlanmamış dəyişikliklər"
      message="Etdiyiniz dəyişikliklər yadda saxlanmayıb. Səhifədən çıxsanız, onlar itəcək."
      confirmLabel="Çıx"
      cancelLabel="Səhifədə qal"
      onConfirm={() => blocker.proceed?.()}
      onCancel={() => blocker.reset?.()}
    />
  )
}
