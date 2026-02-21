import {create} from 'zustand'
import http from '../http.js'
import { toast } from 'react-toastify'

const generateCodeChallenge = (length = 64) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
    let result = ""

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return result
}

const useAuthStore = create((set, get) => ({
    profile: null,
    authenticated: null,
    isAuthenticating: false,

    login : async () => {
        const returnUrl = window.location.href;
        const code_challenge = generateCodeChallenge()
        localStorage.setItem("code_verifier", code_challenge)

        const params = {
            response_type: "code",
            client_id: import.meta.env.VITE_CLIENT_ID,
            code_challenge: code_challenge,
            code_challenge_method: "plain",
            state: "puppy",
            redirect_uri: encodeURIComponent(import.meta.env.VITE_BASE_URL + "/auth/mal/callback"),
            state: encodeURIComponent(returnUrl),
        }
        
        let string = ''
        Object.entries(params).map(([key, value], index)=>{
            string += index === 0 ? `?${key}=${value}` : `&${key}=${value}`
        })
        
        const url = `https://myanimelist.net/v1/oauth2/authorize` + string
        window.location.href = url
    },

    setAuthData: (profile, authenticated) => {
        set({ profile, authenticated, isAuthenticating: false });
    },

    logout: async () => {
        const profile = get().profile
        
        if(profile)
        {
            try {
                set({isAuthenticating: true})
                const response = await http.post('auth/mal/logout', {user_id: profile.id})
                set({profile: null, authenticated: false})
                // window.location.reload()
            } catch (error) {
                console.log(error)
            } finally {
                set({isAuthenticating: false})
            }
        }
    },

}))

export default useAuthStore