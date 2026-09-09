import { defineStore } from 'pinia'
import api from '../api/api'

export const useExamStore = defineStore({
  id: 'exam',
  state: () => ({
    taskAnswers: [],
    exams: JSON.parse(localStorage.getItem('exams')),
    currentExam: JSON.parse(localStorage.getItem('currentExam')),
    answerParams: null,
    typeExam: null,
    variantType: JSON.parse(localStorage.getItem('variantType')) || null 
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
    
    // Новое действие для установки и сохранения типа варианта
    setVariantType(type) {
      this.variantType = type
      if (type) {
        localStorage.setItem('variantType', JSON.stringify(type))
      } else {
        localStorage.removeItem('variantType')
      }
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

    setExamAnswers(variantType = 'author') {
      return new Promise(async (resolve, reject) => {
        try {
          const tasksData = this.transformSavedAnswers(this.taskAnswers)
          const payload = {
            variant_type: this.variantType || variantType ||  'author', // Используем тип из store, если не передан
            tasks: tasksData
          }

          let res = await api({
            method: 'POST',
            url: `answers/`,
            data: payload
          })

          this.answerParams = res.data
          localStorage.setItem('answerParams', JSON.stringify(this.answerParams))
          resolve(this.answerParams)
        } catch (err) {
          reject(err)
        }
      })
    },
    generateRandomExam(typeExam) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await api({
            method: 'POST',
            url: `${typeExam}/generated-exams/generate/`
          })

          this.typeExam = typeExam
          this.currentExam = res.data.tasks

          localStorage.setItem('currentExam', JSON.stringify(this.currentExam))
          resolve(res.data)
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
          localStorage.setItem('answerParams', JSON.stringify(this.answerParams))
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
    getAnswers(params = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          let url = '/answers/'

          if (params.id) {
            url += `${params.id}/`
            if (params.withTasks) {
              url += '?with_tasks=1'
            }

            const res = await api({
              method: 'GET',
              url
            })
            resolve(res.data)
            return
          }

          const queryParams = new URLSearchParams()

          if (params.status !== undefined && params.status !== null) {
            queryParams.append('status', params.status)
          }

          if (params.offset !== undefined && params.offset !== null) {
            queryParams.append('offset', params.offset)
          }

          if (params.limit !== undefined && params.limit !== null) {
            queryParams.append('limit', params.limit)
          }

          if (params.withTasks) {
            queryParams.append('with_tasks', 1)
          }

          const queryString = queryParams.toString()
          if (queryString) {
            url += `?${queryString}`
          }

          const res = await api({
            method: 'GET',
            url
          })

          if (params.offset !== undefined || params.limit !== undefined) {
            const data = res.data
            resolve({
              results: data.results || [],
              count: data.count || 0,
              next: data.next,
              previous: data.previous,
              hasMore: !!data.next,
              nextOffset: data.next
                ? new URL(data.next).searchParams.get('offset')
                : 0
            })
          } else {
            resolve(res.data)
          }
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
    resetExamStore() {
      this.taskAnswers = []
      this.exams = null
      this.currentExam = null
      this.answerParams = null
      this.typeExam = null
      this.variantType = null // Очищаем тип варианта

      // Очищаем localStorage
      localStorage.removeItem('exams')
      localStorage.removeItem('currentExam')
      localStorage.removeItem('answerParams')
      localStorage.removeItem('variantType') // Очищаем тип варианта
      localStorage.removeItem('isRandomExam') // Убираем старый костыль
    }
  }
})