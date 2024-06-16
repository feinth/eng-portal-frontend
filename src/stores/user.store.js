import { defineStore } from 'pinia'
import api from '../api/api'
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    orders: null
  }),
  actions: {
    login(username, password) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await api({
            method: 'post',
            url: 'User/authenticate',
            data: { username: username, password: password }
          })
          this.user = res.data
          localStorage.setItem('user', JSON.stringify(this.user))
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    }
  }
})
