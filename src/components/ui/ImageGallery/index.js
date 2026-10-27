import cameraPlus from '@/assets/icons/camera-plus.svg'
import imageDelete from '@/assets/icons/image-delete.svg'
import rotateLeft from '@/assets/icons/rotate-left.svg'
import rotateRight from '@/assets/icons/rotate-right.svg'
import { newId } from '@/data/store'
import { useRef } from 'react'

const overlayButton = 'absolute flex items-center justify-center bg-white/[.88] shadow-sm transition-colors hover:bg-white'

/** Məhsul şəkilləri: sil, sola/sağa döndər, yenisini əlavə et. readOnly-də yalnız baxış. */
export function ImageGallery({ images, onChange, readOnly }) {
  const inputRef = useRef(null)

  const rotate = (id, delta) =>
    onChange(images.map((img) => (img.id === id ? { ...img, rotation: (img.rotation + delta + 360) % 360 } : img)))

  const addFiles = (files) => {
    const added = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({ id: newId('img'), url: URL.createObjectURL(f), rotation: 0 }))
    if (added.length) onChange([...images, ...added])
  }

  return (
    <div className="flex flex-col gap-3.5 rounded-lg bg-white p-[18px]">
      <h2 className="text-base font-semibold text-ink">Məhsul şəkilləri</h2>
      {readOnly && <p className="text-xs text-placeholder">Məhsula aid şəkillər.</p>}
      <div className="flex flex-wrap items-center gap-6 py-[22px]">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative h-[176px] w-[280px] max-w-full overflow-hidden rounded-lg border border-[#e3e8f0] bg-[#f2f2f2]"
          >
            <img
              src={img.url}
              alt=""
              className="size-full object-cover transition-transform duration-200"
              style={{ transform: `rotate(${img.rotation}deg)` }}
            />
            {!readOnly && (
              <>
                <button
                  type="button"
                  aria-label="Şəkli sil"
                  onClick={() => onChange(images.filter((i) => i.id !== img.id))}
                  className={`${overlayButton} right-[7px] top-[7px] size-[30px] rounded-[15px]`}
                >
                  <img src={imageDelete} width={16} height={16} alt="" />
                </button>
                <button
                  type="button"
                  aria-label="Sola döndər"
                  onClick={() => rotate(img.id, -90)}
                  className={`${overlayButton} bottom-[7px] left-[7px] size-8 rounded-2xl`}
                >
                  <img src={rotateLeft} width={19} height={19} alt="" />
                </button>
                <button
                  type="button"
                  aria-label="Sağa döndər"
                  onClick={() => rotate(img.id, 90)}
                  className={`${overlayButton} bottom-[7px] right-[7px] size-8 rounded-2xl`}
                >
                  <img src={rotateRight} width={19} height={19} alt="" />
                </button>
              </>
            )}
          </div>
        ))}
        {!readOnly && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              addFiles(e.dataTransfer.files)
            }}
            className="flex h-[176px] w-[260px] max-w-full flex-col items-center justify-center gap-2.5 rounded-lg bg-[#f2f2f2] transition-colors hover:bg-[#ebebeb]"
          >
            <img src={cameraPlus} width={34} height={34} alt="" />
            <span className="text-sm font-medium text-ink">{images.length ? 'Digər şəkillər' : 'Şəkil əlavə et'}</span>
          </button>
        )}
        {readOnly && images.length === 0 && <p className="text-sm text-muted">Şəkil yoxdur</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files ?? [])
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}
