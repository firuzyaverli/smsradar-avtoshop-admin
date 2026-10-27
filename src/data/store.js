import { useSyncExternalStore } from 'react'
import * as mock from './mock'

/**
 * Yaddaşda saxlanılan sadə kolleksiya. Backend qoşulanda bu fayl API çağırışları ilə əvəz olunacaq —
 * səhifələr yalnız aşağıdakı hook-lardan və metodlardan istifadə edir.
 */
function createCollection(initial) {
  let items = initial
  const listeners = new Set()
  const emit = () => listeners.forEach((l) => l())
  return {
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getAll: () => items,
    get: (id) => items.find((i) => i.id === id),
    create(item) {
      items = [item, ...items]
      emit()
    },
    update(id, patch) {
      items = items.map((i) => (i.id === id ? { ...i, ...patch } : i))
      emit()
    },
    remove(id) {
      items = items.filter((i) => i.id !== id)
      emit()
    },
  }
}

export const categoriesStore = createCollection(mock.categories)

export const compatibilitiesStore = createCollection(mock.compatibilities)

export const productsStore = createCollection(mock.products)

export const ordersStore = createCollection(mock.orders)

export const deliveriesStore = createCollection(mock.deliveries)

function useCollection(store) {
  return useSyncExternalStore(store.subscribe, store.getAll)
}

export const useCategories = () => useCollection(categoriesStore)

export const useCompatibilities = () => useCollection(compatibilitiesStore)

export const useProducts = () => useCollection(productsStore)

export const useOrders = () => useCollection(ordersStore)

export const useDeliveries = () => useCollection(deliveriesStore)

export function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}
