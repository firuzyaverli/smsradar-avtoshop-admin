import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import '@/assets/css/index.css'
import { router } from '@/config/router'

export function App() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<App />)
