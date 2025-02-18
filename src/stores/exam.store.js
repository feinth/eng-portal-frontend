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
    audioGuidance: null,
    isIntroAudioPlayed: false,
    typeExam: null
  }),
  actions: {
    async playIntroAudio() {
      if (!this.isIntroAudioPlayed && this.audioGuidance?.start_exam_audio) {
        const audio = new Audio(this.audioGuidance.start_exam_audio)
        await new Promise((resolve) => {
          audio.play()
          audio.onended = () => {
            this.isIntroAudioPlayed = true
            resolve()
          }
        })
      }
    },
    addAudioFile(taskAnswer) {
      this.taskAnswers.push(taskAnswer)
    },
    clearAudioFiles() {
      this.taskAnswers = []
    },
    getAudioFiles() {
      return this.audioFiles
    },
    getExams(typeExam, fipi = null) {
      return new Promise(async (resolve, reject) => {
        try {
          // Формируем URL в зависимости от переданных параметров
          let url = `${typeExam}/exams/`
          if (fipi !== null) {
            url += `?fipi=${fipi}` // Добавляем параметр fipi, если он передан
          }

          // Выполняем запрос к API
          let res = await api({
            method: 'get',
            url: url
          })

          // Сохраняем данные в хранилище
          this.exams = res.data
          this.typeExam = typeExam
          localStorage.setItem('exams', JSON.stringify(this.exams))

          resolve(this.exams)
        } catch (err) {
          reject(err)
        }
      })
    },
    getExamTasks() {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await api({
            method: 'get',
            url: `${this.typeExam}/tasks/?exam_id=${this.currentExamID}`
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
      return new Promise(async (resolve, reject) => {
        try {
          this.currentExamID = id
          localStorage.setItem('currentExamID', this.currentExamID)
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },
    getAnswers(id = null, withTasks = false) {
      return new Promise(async (resolve, reject) => {
        try {
          // Формируем URL в зависимости от переданных параметров
          let url = '/answers/'
          if (id) {
            url += `${id}`
          }
          if (withTasks) {
            url += '?with_tasks=1'
          }

          // Выполняем запрос к API
          const res = await api({
            method: 'GET',
            url
          })

          resolve(res.data)
        } catch (err) {
          reject(err)
        }
      })
    },
    getTasksByType(typeExam = null, taskType = false) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await api({
            method: 'GET',
            url: `${typeExam}/tasks/?task_type=${taskType}`
          })

          resolve(res.data)
        } catch (err) {
          reject(err)
        }
      })
    }
  }
})
