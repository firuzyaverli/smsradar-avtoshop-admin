import bellIcon from '@/assets/icons/bell.svg'
import flagAz from '@/assets/icons/flag-az.svg'
import logoMark from '@/assets/icons/logo-mark.svg'
import userIcon from '@/assets/icons/user.svg'
import { Popover } from '@/components/ui'
import { toast } from '@/lib/toast'
import { LogOut, Menu } from 'lucide-react'
import { Link } from 'react-router'

export function Header({ onOpenMenu }) {
  return (
    <header className="sticky top-0 z-40 flex h-[58px] items-center justify-between border-b border-[#e5ebf0] bg-white px-[18px]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Menyunu aç"
          className="-ml-1 rounded-md p-1 text-ink-2 hover:bg-page lg:hidden"
        >
          <Menu size={22} />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <img src={logoMark} width={28} height={28} alt="" />
          <span className="text-[13px] font-bold text-brand">SMSRADAR</span>
        </Link>
      </div>

      <div className="flex items-center gap-3.5">
        <Popover
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label="Bildirişlər"
              className="flex size-[30px] items-center justify-center rounded-full hover:bg-page"
            >
              <img src={bellIcon} width={18} height={18} alt="" />
            </button>
          )}
        >
          <p className="px-2 py-3 text-center text-xs text-muted">Yeni bildiriş yoxdur</p>
        </Popover>

        {/* Hələlik tək dil var — seçim menyusu yoxdur */}
        <span
          role="img"
          aria-label="Dil: Azərbaycan"
          title="Azərbaycan dili"
          className="flex size-7 items-center justify-center rounded-[14px] bg-[#f7fafc]"
        >
          <img src={flagAz} width={16} height={12} alt="" className="rounded-[2px]" />
        </span>

        <Popover
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label="Profil"
              className="flex size-8 items-center justify-center rounded-2xl bg-brand"
            >
              <img src={userIcon} width={16} height={16} alt="" />
            </button>
          )}
        >
          <div className="border-b border-line px-2 pb-2 pt-1">
            <p className="text-sm font-semibold text-ink">Admin</p>
            <p className="text-xs text-muted">SMSRadar Avto Market</p>
          </div>
          <button
            type="button"
            onClick={() => toast('Giriş sistemi hələ qoşulmayıb', 'error')}
            className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-danger-text hover:bg-page"
          >
            <LogOut size={16} />
            Çıxış
          </button>
        </Popover>
      </div>
    </header>
  )
}
