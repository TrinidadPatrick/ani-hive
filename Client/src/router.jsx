import {createBrowserRouter} from 'react-router-dom'
import App from './App'
import Home from './Components/Home/Home'
import UserLayout from './Components/UserLayout/UserLayout'
import Genres from './Components/Genres/Genres'
import AnimeOverView from './Components/AnimeInfo/AnimeOverView'

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
            {
                path: '/anime/:id',
                element: <AnimeOverView />
            }
        ]
    },
   
])

export default router