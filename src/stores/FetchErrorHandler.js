import {create} from 'zustand'

const useErrorHandler = create((set) => ({
    errorStatus: null,
    setErrorStatus: (value) => set({errorStatus: value})
}))

export default useErrorHandler