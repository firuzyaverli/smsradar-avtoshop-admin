import { useEffect, useRef } from 'react'
import { useBlocker } from 'react-router'

/**
 * Yadda saxlanmamış dəyişiklik varsa başqa səhifəyə keçidi saxlayır (təsdiq üçün)
 * və brauzer tabını bağlamaq/yeniləmək istəyəndə xəbərdarlıq edir.
 * Eyni səhifə daxilində tab dəyişmək (?tab=...) bloklanmır.
 */
export function useUnsavedChanges(dirty) {
  const bypass = useRef(false)

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && !bypass.current && currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  /** Yadda saxladıqdan sonra edilən keçid bloklanmasın */
  const allowNavigation = () => {
    bypass.current = true
  }

  return { blocker, allowNavigation }
}
