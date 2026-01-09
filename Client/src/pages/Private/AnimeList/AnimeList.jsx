import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useUserAnimeStore from '../../../stores/UserAnimeStore'

const AnimeList = () => {
  const {status} = useParams()
  const getList = useUserAnimeStore((s) => s.getList)

  useEffect(() => {
    getList(status)
  }, [status])

  return (
    <div>AnimeList</div>
  )
}

export default AnimeList