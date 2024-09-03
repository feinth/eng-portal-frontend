import { defineStore } from 'pinia'
import api from '../api/api'
import tasksData from '../assets/tasks.json'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
    audioFiles: [],
    tasks: null,
    currentExamTask: null
  }),
  actions: {
    login(email, password) {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await api({
            method: 'post',
            url: 'auth/login/',
            data: { email: email, password: password }
          })
          this.token = response.data
          localStorage.setItem('token', this.token )
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },
    register(user) {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await api({
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
          this.token = response.data
          localStorage.setItem('token', this.token)
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },
    getUserData() {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await api({
            method: 'get',
            url: 'users/me/', 
          })
          this.user = response.data
          localStorage.setItem('user', JSON.stringify(this.user))
          resolve(response.data)
        } catch (err) {
          this.clearAuth()
          reject(err)
        }
      })
    },
    updateUserData() {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await api({
            method: 'put',
            url: 'users/me/',
            data: this.user
          })
          this.user = response.data
          localStorage.setItem('user', JSON.stringify(this.user))
          resolve(response.data)
        } catch (err) {
          this.clearAuth()
          reject(err)
        }
      })
    },
    logout() {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await api({
            method: 'post',
            url: 'auth/logout/'
          })
          this.clearAuth()
          resolve(response.data)
        } catch (err) {
          reject(err)
        }
      })
    },
    clearAuth() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    addAudioFile(audioFile) {
      this.audioFiles.push(audioFile)
    },
    clearAudioFiles() {
      this.audioFiles = []
    },
    getAudioFiles() {
      return this.audioFiles
    },
    getExams(examId, typeId) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(tasksData[examId])
        }, 1000);
      });
    },
    getExamTasks(examId) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await api({
            method: 'get',
            url: 'ege/exams/${examId}',
          })
          this.currentExamTask = res
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    }
  }
})