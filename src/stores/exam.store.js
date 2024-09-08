import { defineStore } from 'pinia'
import api from '../api/api'

export const useExamStore = defineStore({
  id: 'exam',
  state: () => ({
    taskAnswers: [],
    exams: JSON.parse(localStorage.getItem('exams')),
    currentExam: JSON.parse(localStorage.getItem('currentExam'))
  }),
  actions: {
    addAudioFile(taskAnswer) {
      this.taskAnswers.push(taskAnswer)
    },
    clearAudioFiles() {
      this.taskAnswers = []
    },
    getAudioFiles() {
      return this.audioFiles
    },
    getExams(typeExam) {
      return new Promise(async (resolve, reject) => {
        let res = await api({
          method: 'get',
          url: `${typeExam}/exams/`
        })
        this.exams = res.data
        localStorage.setItem('exams', JSON.stringify(this.exams))
        resolve(this.exams)
      })
    },
    getExamTasks(examId) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await api({
            method: 'get',
            url: `ege/exams/${examId}`
          })
          this.currentExam = res.data
          localStorage.setItem('currentExam', JSON.stringify(this.currentExam))
          resolve(this.currentExam)
        } catch (err) {
          reject(err)
        }
      })
    }
  }
})
