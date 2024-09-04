import { defineStore } from 'pinia'
import api from '../api/api'
import examsData from '../assets/tasks.json'
import tasksData from '../assets/exam_.json'

export const useExamStore = defineStore({
  id: 'exam',
  state: () => ({
    audioFiles: [],
    tasks: null,
    currentExamTask: null
  }),
  actions: {
    addAudioFile(audioFile) {
      this.audioFiles.push(audioFile)
    },
    clearAudioFiles() {
      this.audioFiles = []
    },
    getAudioFiles() {
      return this.audioFiles
    },
    getExams() {
      return new Promise(async (resolve, reject) => {
        resolve(examsData)
      })
    },
    getExamTasks(examId) {
      return new Promise(async (resolve, reject) => {
        try {
          // let res = await api({
          //   method: 'get',
          //   url: 'ege/exams/${examId}'
          // })
          this.currentExamTask = tasksData
          resolve(tasksData)
        } catch (err) {
          reject(err)
        }
      })
    }
  }
})
