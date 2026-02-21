import { RouterProvider, useLocation } from "react-router-dom"
import router from "./router"
import { useEffect } from "react"
import AnimeInfoNotFound from "./components/ErrorHandlerComponent/AnimeInfoNotFound.jsx"
import useErrorHandler from "./stores/FetchErrorHandler.js"
import MainHandler from "./components/ErrorHandlerComponent/MainHandler.jsx"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <main className="">
        <RouterProvider router={router} />
      </main>
    </QueryClientProvider>
  )
}

export default App
