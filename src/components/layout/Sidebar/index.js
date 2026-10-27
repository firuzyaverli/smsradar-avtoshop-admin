import navCategories from '@/assets/icons/nav-categories.svg'
// import navCompat from '@/assets/icons/nav-compat.svg'
import navDelivery from '@/assets/icons/nav-delivery.svg'
import navOrders from '@/assets/icons/nav-orders.svg'
import navPanel from '@/assets/icons/nav-panel.svg'
import navProducts from '@/assets/icons/nav-products.svg'
import { MaskIcon } from '@/components/ui'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { NavLink } from 'react-router'

const NAV = [
  { to: '/', label: 'Panel', icon: navPanel, end: true },
  { to: '/products', label: 'Məhsullar', icon: navProducts },
  { to: '/orders', label: 'Sifarişlər', icon: navOrders },
  { to: '/categories', label: 'Kateqoriyalar', icon: navCategories },
  // { to: '/compatibilities', label: 'Uyğunluqlar', icon: navCompat },
  { to: '/deliveries', label: 'Çatdırılmalar', icon: navDelivery },
]

export function Sidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-[#1a1f29]/30 lg:hidden" onClick={onCloseMobile} />}
      <aside
        className={clsx(
          'flex flex-col gap-2.5 overflow-hidden rounded-lg bg-white pt-3.5 transition-[width,transform] duration-200',
          // Mobil: soldan açılan panel
          'fixed inset-y-0 left-0 z-50 w-[292px] rounded-l-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: səhifədə sabit kart
          'lg:sticky lg:top-[74px] lg:z-auto lg:h-[calc(100dvh-90px)] lg:translate-x-0 lg:rounded-lg',
          collapsed ? 'lg:w-[72px]' : 'lg:w-[292px]',
        )}
      >
        <div className="flex h-[62px] shrink-0 items-center justify-between px-3.5 text-muted">
          <span className={clsx('whitespace-nowrap text-2xl font-bold', collapsed && 'lg:hidden')}>Avto Market</span>
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? 'Menyunu genişləndir' : 'Menyunu daralt'}
            className={clsx(
              'hidden rounded-md px-1 text-[22px] font-medium hover:text-ink lg:block',
              collapsed && 'mx-auto',
            )}
          >
            ☰
          </button>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Menyunu bağla"
            className="rounded-md p-1 hover:text-ink lg:hidden"
          >
            <X size={22} />
          </button>
        </div>
        <div className="h-px shrink-0 bg-line" />
        <nav className="flex flex-col gap-2.5 overflow-y-auto pb-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                clsx(
                  'flex h-12 shrink-0 items-center gap-3 rounded-[7px] pl-3.5 pr-3 text-sm font-medium transition-colors',
                  collapsed ? 'lg:mx-2.5 lg:justify-center lg:px-0' : 'mr-3.5',
                  isActive ? 'bg-brand-soft text-brand' : 'text-ink-2 hover:bg-page',
                )
              }
            >
              <MaskIcon src={item.icon} />
              <span className={clsx('whitespace-nowrap', collapsed && 'lg:hidden')}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
