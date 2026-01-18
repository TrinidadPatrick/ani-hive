import {createBrowserRouter} from 'react-router-dom'
import Home from './pages/Home/Home'
import UserLayout from './pages/Layout/UserLayout'
import AnimeOverView from './pages/AnimeInfo/AnimeOverView'
import Schedule from './pages/Schedule/Schedule'
import Explore from './pages/Explore/Explore'
import Characters from './pages/Characters/Characters'
import MalCallback from './pages/AuthCallback/MalCallback'
import PrivateLayout from './pages/Layout/PrivateLayout.jsx'
import AnimeList from './pages/Private/AnimeList/AnimeList.jsx'
import PageNotFound from './components/ErrorHandlerComponent/PageNotFound.jsx'
import VoiceActorDetails from './pages/VoiceActor/VoiceActorDetails.jsx'

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
                path: '/voice-actor/:id',
                element: <VoiceActorDetails />
            },

            // Private Route
            {
                path: '/user',
                element: <PrivateLayout />,
                children: [
                    {
                        path: 'anime-list/:status',
                        element: <AnimeList />
                    }
                ]
            },
            {
                path: '*',
                element: <PageNotFound />
            }
        ]
    },
    {
        path: '/auth/mal/callback',
        element: <MalCallback />
    },
   
])

export default router