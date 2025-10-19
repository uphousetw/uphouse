import './styles/globals.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './routes'
import { AuthProvider } from './providers/AuthProvider'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Failed to find root element')
}

const root = createRoot(container)

root.render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
