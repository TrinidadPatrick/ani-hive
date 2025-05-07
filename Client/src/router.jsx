import {createBrowserRouter} from 'react-router-dom'
import App from './App'
import Home from './Components/Home/Home'
import UserLayout from './Components/UserLayout/UserLayout'
import Categories from './Components/Categories/Categories'

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
                path: '/categories',
                element: <Categories />
            },
        ]
    }
])

export default router