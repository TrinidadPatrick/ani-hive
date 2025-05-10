import {createBrowserRouter} from 'react-router-dom'
import App from './App'
import Home from './Components/Home/Home'
import UserLayout from './Components/UserLayout/UserLayout'
import Genres from './Components/Genres/Genres'

const router = createBrowserRouter([
    {
        path: '/',
        element: <UserLayout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/genres',
                element: <Genres />
            },
        ]
    }
])

export default router