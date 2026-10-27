import clsx from 'clsx'

const variants = {
  primary: 'bg-brand text-white hover:bg-[#08785f]',
  danger: 'bg-danger text-white hover:bg-[#cc2536]',
  outline: 'border border-line bg-white text-ink hover:bg-page',
}

/** "Yadda saxla" / "Bağla" düymələri: 140×40, radius 7, SemiBold 12px */
export function Button({ variant = 'primary', className, type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex h-10 min-w-[140px] items-center justify-center gap-2 rounded-[7px] px-4 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
