'use client'

import 'bootstrap/dist/css/bootstrap.min.css'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { AuthProvider } from '@/context/AuthContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  )
} 