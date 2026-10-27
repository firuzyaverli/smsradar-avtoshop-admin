import clsx from 'clsx'

/**
 * Figma-dan gələn SVG ikonunu dəyişmədən istifadə edir, amma rəngini `currentColor`-dan alır
 * (aktiv/passiv menyu elementləri üçün).
 */
export function MaskIcon({ src, size = 20, className }) {
  return (
    <span
      aria-hidden
      className={clsx('inline-block shrink-0 bg-current', className)}
      style={{
        width: size,
        height: size,
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  )
}
