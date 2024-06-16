import axios from 'axios'
import { useUserStore } from '../stores/user.store'

const api = axios.create({ baseURL: `${import.meta.env.VITE_API_URL}/api` })

api.interceptors.request.use(
  (config) => {
    const store = useUserStore()
    if (store.user) {
      config.headers.authorization = `Bearer ${store.user.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
