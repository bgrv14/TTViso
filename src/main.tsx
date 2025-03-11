import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { SelectedMealsProvider } from './context/SelectedMealsContext'
import { PaginationProvider } from './context/PaginationContext'
import App from './App'
import './index.css'

// Створюємо клієнт для React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 хвилин
      gcTime: 1000 * 60 * 30, // 30 хвилин
      retry: 2,
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PaginationProvider>
          <SelectedMealsProvider>
            <App />
          </SelectedMealsProvider>
        </PaginationProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
