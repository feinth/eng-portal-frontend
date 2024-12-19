import { defineStore } from 'pinia'
import api from '../api/api'

export const useExamStore = defineStore({
  id: 'exam',
  state: () => ({
    taskAnswers: [],
    exams: JSON.parse(localStorage.getItem('exams')),
    currentExam: JSON.parse(localStorage.getItem('currentExam')),
    currentExamID: localStorage.getItem('currentExamID'),
    answerParams: null,
    audioGuidance: null
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
    getExamTasks() {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await api({
            method: 'get',
            url: `ege/tasks/?exam_id=${this.currentExamID}`
          })
          this.currentExam = res.data
          localStorage.setItem('currentExam', JSON.stringify(this.currentExam))
          resolve(this.currentExam)
        } catch (err) {
          reject(err)
        }
      })
    },
    setExamAnswers() {
      return new Promise(async (resolve, reject) => {
        try {
          const answers = this.transformSavedAnswers(this.taskAnswers)

          let res = await api({
            method: 'POST',
            url: `answers/`,
            data: answers
          })

          this.answerParams = res.data
          localStorage.setItem(
            'answerParams',
            JSON.stringify(this.answerParams)
          )
          resolve(this.answerParams)
        } catch (err) {
          reject(err)
        }
      })
    },
    getExamAnswers(id) {
      return new Promise(async (resolve, reject) => {
        try {
          const answers = this.transformSavedAnswers(this.taskAnswers)

          let res = await api({
            method: 'GET',
            url: `answers/${id}`
          })

          this.answerParams = res.data
          localStorage.setItem(
            'answerParams',
            JSON.stringify(this.answerParams)
          )
          resolve(this.answerParams)
        } catch (err) {
          reject(err)
        }
      })
    },
    transformSavedAnswers(savedAnswers) {
      const result = []

      savedAnswers.forEach((file) => {
        let task = result.find((item) => item.task_id === file.taskId)

        if (!task) {
          task = {
            task_id: file.taskId,
            audio: null,
            questions: []
          }
          result.push(task)
        }

        if (file.assignmentId) {
          task.questions.push({
            question_id: file.assignmentId,
            audio: file.audioBase64
          })
        } else {
          task.audio = file.audioBase64
        }
      })
      return result
    },
    getAudioGuidance() {
      return new Promise(async (resolve, reject) => {
        try {

          let res = await api({
            method: 'GET',
            url: `/audio-guidance`
          })

          this.audioGuidance = res.data
          localStorage.setItem(
            'audioGuidance',
            JSON.stringify(this.audioGuidance)
          )
          resolve(this.audioGuidance)
        } catch (err) {
          reject(err)
        }
      })
    },
    setExamId(id) {
      this.currentExamID = id
      localStorage.setItem('currentExamID', this.currentExamID)
    },
    getExamData() {
      this.getExamTasks()
      this.getAudioGuidance()
    }
  }
})
