import { defineStore } from 'pinia'
import api from '../api/api'

export const useExamStore = defineStore({
  id: 'exam',
  state: () => ({
    taskAnswers: [],
    exams: JSON.parse(localStorage.getItem('exams')),
    currentExam: JSON.parse(localStorage.getItem('currentExam')),
    answerParams: null,
    audioGuidance: null,
    typeExam: null,
    generatedExamId: null
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
    getExams(typeExam, fipi = null) {
      return new Promise(async (resolve, reject) => {
        try {
          let url = `${typeExam}/exams/`
          if (fipi !== null) {
            url += `?fipi=${fipi}`
          }

          let res = await api({
            method: 'get',
            url: url
          })

          this.exams = res.data
          this.typeExam = typeExam
          localStorage.setItem('exams', JSON.stringify(this.exams))

          resolve(this.exams)
        } catch (err) {
          reject(err)
        }
      })
    },
    getExamTasks(examID) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await api({
            method: 'get',
            url: `${this.typeExam}/tasks/?exam_id=${examID}`
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
    getAnswers(id = null, withTasks = false) {
      return new Promise(async (resolve, reject) => {
        try {
          let url = '/answers/'
          if (id) {
            url += `${id}`
          }
          if (withTasks) {
            url += '?with_tasks=1'
          }

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
          this.typeExam = typeExam
          resolve(res.data)
        } catch (err) {
          reject(err)
        }
      })
    },
    getTasksById(id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await api({
            method: 'GET',
            url: `${this.typeExam}/tasks/${id}`
          })
          this.currentExam = [res.data]
          localStorage.setItem('currentExam', JSON.stringify(this.currentExam))
          resolve(this.currentExam)
        } catch (err) {
          reject(err)
        }
      })
    },
    // ← НОВЫЙ ACTION: генерация случайного варианта
    generateRandomExam(examType) {
      return new Promise(async (resolve, reject) => {
        try {
          // examType: 1=ЕГЭ, 2=ОГЭ (из enum ExamType)
          const urlPrefix = examType === 1 ? 'ege' : 'oge'

          const res = await api({
            method: 'POST',
            url: `${urlPrefix}/generated-exams/`
          })

          // Сохраняем ID сгенерированного варианта
          this.generatedExamId = res.data.id
          
          // Сохраняем задания в том же формате, что и обычный экзамен
          this.currentExam = res.data.tasks
          this.typeExam = urlPrefix
          
          // Сохраняем в localStorage, чтобы не потерять при перезагрузке
          localStorage.setItem('currentExam', JSON.stringify(this.currentExam))
          localStorage.setItem('generatedExamId', JSON.stringify(this.generatedExamId))

          resolve(res.data)
        } catch (err) {
          reject(err)
        }
      })
    },
    // ← НОВЫЙ ACTION: загрузка ранее сгенерированного варианта по ID
    getGeneratedExam(examType, examId) {
      return new Promise(async (resolve, reject) => {
        try {
          const urlPrefix = examType === 1 ? 'ege' : 'oge'

          const res = await api({
            method: 'GET',
            url: `${urlPrefix}/generated-exams/${examId}/`
          })

          this.generatedExamId = res.data.id
          this.currentExam = res.data.tasks
          this.typeExam = urlPrefix
          
          localStorage.setItem('currentExam', JSON.stringify(this.currentExam))
          localStorage.setItem('generatedExamId', JSON.stringify(this.generatedExamId))

          resolve(res.data)
        } catch (err) {
          reject(err)
        }
      })
    }
  }
})