import { Link } from 'react-router'

export function NotFoundPage({ title = 'Səhifə tapılmadı' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-lg bg-white p-8 text-center">
      <h1 className="text-xl font-semibold text-heading">{title}</h1>
      <p className="text-sm text-muted">Axtardığınız səhifə mövcud deyil və ya silinib.</p>
      <Link to="/" className="text-sm font-semibold text-brand hover:underline">
        Panelə qayıt
      </Link>
    </div>
  )
}
