import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import http from "../../../http"


const getWatchOrder = async (title) => {
    const result = await http.post('ask/watch-order', {title})

    return result.data
}


export const useWatchOrder = () => {

    return useMutation({
        mutationFn: (title) =>getWatchOrder(title)
    })
}