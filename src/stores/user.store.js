import { defineStore } from 'pinia'
import api from '../api/api'
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    audioFiles: []
  }),
  actions: {
    login(email, password) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await api({
            method: 'post',
            url: 'auth/login/',
            data: { email: email, password: password }
          })
          this.user = res.data
          console.log(this.user)
          localStorage.setItem('user', JSON.stringify(this.user))
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },
    register(user) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await api({
            method: 'post',
            url: 'auth/register/',
            data: {
              email: user.email,
              password: user.password,
              first_name: user.firstName,
              second_name: user.secondName,
              birthdate: user.birthdate,
              phone: user.phone
            }
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
    },
    addAudioFile(audioFile) {
      this.audioFiles.push(audioFile)
    },
    clearAudioFiles() {
      this.audioFiles = []
    },
    getAudioFiles() {
      return this.audioFiles
    }
  }
})
