import React from 'react'

const LoginButton = () => {

    const generateCodeChallenge = (length = 64) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
        let result = ""

        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }

        return result
    }

    const login = async () => {

        const code_challenge = generateCodeChallenge()
        localStorage.setItem("code_verifier", code_challenge)

        const params = {
            response_type: "code",
            client_id: import.meta.env.VITE_CLIENT_ID,
            code_challenge: code_challenge,
            code_challenge_method: "plain",
            state: "puppy",
            redirect_uri: encodeURIComponent("http://localhost:5173/auth/mal/callback"),
        }
        
        let string = ''
        Object.entries(params).map(([key, value], index)=>{
            string += index === 0 ? `?${key}=${value}` : `&${key}=${value}`
        })
        
        const url = `https://myanimelist.net/v1/oauth2/authorize` + string
        console.log(url)
        window.location.href = url
    }

  return (
    <button
    title='Login to MAL'
        onClick={login}
        className="h-full group relative px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
      >
        <span className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fdfdfd" d="M8.45 15.91H6.067v-5.506h-.028l-1.833 2.454l-1.796-2.454h-.02v5.507H0V6.808h2.263l1.943 2.671l1.98-2.671H8.45zm8.499 0h-2.384v-2.883H11.96c.008 1.011.373 1.989.914 2.884l-1.942 1.284c-.52-.793-1.415-2.458-1.415-4.527c0-1.015.211-2.942 1.638-4.37a4.8 4.8 0 0 1 2.737-1.37c.96-.15 1.936-.12 2.905-.12l.555 2.051H15.48q-1.164 0-1.839.337c-.637.32-1.009.622-1.447 1.78h2.372v-1.84h2.384zm3.922-2.05H24l-.555 2.05h-4.962V6.809h2.388z"/></svg>
        </span>
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-[shine_1.5s_ease-in-out] translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000"></div>
        </div>
      </button>
  )
}

export default LoginButton