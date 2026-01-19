import React from 'react'
import useAuthStore from '../../stores/AuthStore.js'

const LoginButton = () => {
  const login = useAuthStore((s) => s.login)

  return (
    <button
    title='Login to MAL'
        onClick={login}
        className="cursor-pointer h-full group relative px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
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