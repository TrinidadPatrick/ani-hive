import {createBrowserRouter} from 'react-router-dom'
import App from './App'
import Home from './pages/Home/Home'
import UserLayout from './pages/UserLayout/UserLayout'
import AnimeOverView from './pages/AnimeInfo/AnimeOverView'
import Schedule from './pages/Schedule/Schedule'
import Explore from './pages/Explore/Explore'
import Characters from './pages/Characters/Characters'
import MalCallback from './pages/AuthCallback/MalCallback'

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
                path: '/schedule',
                element: <Schedule />
            },
            {
                path: '/explore',
                element: <Explore />
            },
            {
                path: '/characters',
                element: <Characters />
            },
            {
                path: '/anime/:id',
                element: <AnimeOverView />
            },
            {
                path: '/auth/mal/callback',
                element: <MalCallback />
            }
        ]
    },
   
])

export default router