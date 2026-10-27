import { Toaster } from '@/components/ui'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { Header } from '../Header'
import { Sidebar } from '../Sidebar'

const COLLAPSED_KEY = 'avto-market:sidebar-collapsed'

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Mobil menyu açıq olanda: Esc ilə bağlanır, arxadakı səhifə sürüşmür
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e) => e.key === 'Escape' && setMobileOpen(false)
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [mobileOpen])

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSED_KEY, c ? '0' : '1')
      } catch {
        // brauzer yaddaşı əlçatan deyil — sadəcə yadda saxlamırıq
      }
      return !c
    })
  }
  return (
    <div className="min-h-full">
      <Header onOpenMenu={() => setMobileOpen(true)} />
      <div className="flex items-start gap-[18px] p-4">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  )
}
