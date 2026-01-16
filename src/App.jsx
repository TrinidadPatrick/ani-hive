import { RouterProvider } from "react-router-dom"
import router from "./router"
import { useEffect } from "react"
import AnimeInfoNotFound from "./components/ErrorHandlerComponent/AnimeInfoNotFound.jsx"
import useErrorHandler from "./stores/FetchErrorHandler.js"
import MainHandler from "./components/ErrorHandlerComponent/MainHandler.jsx"

function App() {

  return (
    <main>
      <RouterProvider router={router} />
    </main>
  )
}

export default App
