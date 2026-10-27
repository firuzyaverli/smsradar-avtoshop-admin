// Sadə qlobal bildiriş: toast('Yadda saxlanıldı') və ya toast('Xəta mətni', 'error')
let message = null
let timer
const listeners = new Set()

const emit = () => listeners.forEach((l) => l())

export function toast(text, type = 'success') {
  message = { id: Date.now(), text, type }
  emit()
  clearTimeout(timer)
  timer = setTimeout(() => {
    message = null
    emit()
  }, 3000)
}

export function subscribeToast(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getToast = () => message
