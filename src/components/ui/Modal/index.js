import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/** Figma: başlıq 54px, ağ kart radius 10, alt panel 64px (Yadda saxla / Bağla) */
export function Modal({ open, onClose, title, children, footer, width = 500 }) {
  const dialogRef = useRef(null)
  // onClose hər render-də yeni funksiya olur — effekti yenidən işə salmamaq üçün ref-də saxlayırıq
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement
    // autoFocus olan sahə yoxdursa, fokusu modala keçir
    if (!dialogRef.current?.contains(document.activeElement)) dialogRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onCloseRef.current()
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previouslyFocused?.focus?.()
    }
  }, [open])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1a1f29]/20" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative flex max-h-[calc(100dvh-32px)] w-full flex-col overflow-hidden rounded-[10px] border border-[#dbe0e8] bg-white shadow-[0_16px_40px_rgba(16,24,40,0.18)] outline-none"
        style={{ maxWidth: width }}
      >
        <h2 className="flex h-[54px] shrink-0 items-center px-[18px] text-sm font-semibold text-[#333b45]">{title}</h2>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex h-16 shrink-0 items-center justify-center gap-4 border-t border-[#e3e8f0] px-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  )
}
