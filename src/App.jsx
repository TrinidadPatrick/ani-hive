import { RouterProvider } from "react-router-dom"
import router from "./router"
import { useEffect } from "react"

function App() {

  return (
    <main>
      <RouterProvider router={router} />
    </main>
  )
}

export default App
