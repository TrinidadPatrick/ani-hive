import {createBrowserRouter} from 'react-router-dom'
import App from './App'
import Home from './Components/Home/Home'
import UserLayout from './Components/UserLayout/UserLayout'
import AnimeOverView from './Components/AnimeInfo/AnimeOverView'
import Schedule from './Components/Schedule/Schedule'
import Explore from './Components/Explore/Explore'

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
                path: '/anime/:id',
                element: <AnimeOverView />
            }
        ]
    },
   
])

export default router