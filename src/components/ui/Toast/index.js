import { getToast, subscribeToast } from '@/lib/toast'
import { CircleCheck, TriangleAlert } from 'lucide-react'
import { useSyncExternalStore } from 'react'

export function Toaster() {
  const current = useSyncExternalStore(subscribeToast, getToast)
  if (!current) return null
  const error = current.type === 'error'
  return (
    <div
      key={current.id}
      role={error ? 'alert' : 'status'}
      className="fixed bottom-6 left-1/2 z-[60] flex w-max max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-2 rounded-lg bg-heading px-4 py-3 text-sm font-medium text-white shadow-lg"
    >
      {error ? (
        <TriangleAlert size={18} className="shrink-0 text-[#ff8a8a]" />
      ) : (
        <CircleCheck size={18} className="shrink-0 text-[#5fd3b5]" />
      )}
      {current.text}
    </div>
  )
}
