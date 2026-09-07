import { defineStore } from 'pinia'
import api from '../api/api'

export const useExamStore = defineStore({
  id: 'exam',
  state: () => ({
    taskAnswers: [],
    exams: JSON.parse(localStorage.getItem('exams')),
    currentExam: JSON.parse(localStorage.getItem('currentExam')),
    answerParams: null,
    typeExam: null
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

          // ↓↓↓ Формируем объект вместо простого массива ↓↓↓
          const payload = {
            variant_type: variantType,
            tasks: tasksData
          }

          let res = await api({
            method: 'POST',
            url: `answers/`,
            data: payload // Отправляем объект
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
    generateRandomExam(typeExam) {
      return new Promise(async (resolve, reject) => {
        try {
          // Делаем запрос к эндпоинту генерации (например, ege/generated-exams/generate/)
          const res = await api({
            method: 'POST',
            url: `${typeExam}/generated-exams/generate/`
          })

          // Сохраняем тип экзамена и полученные задания в стейт
          this.typeExam = typeExam
          this.currentExam = res.data.tasks

          // Сохраняем в localStorage, чтобы exam.vue мог прочитать их после редиректа
          localStorage.setItem('currentExam', JSON.stringify(this.currentExam))

          // Возвращаем весь объект ответа, чтобы компонент мог прочитать warnings
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
    getAnswers(params = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          // Формируем URL с параметрами
          let url = '/answers/'

          // Если передан ID - получаем конкретный ответ
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

          // Для списка ответов - формируем query параметры
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

          // Для пагинации возвращаем структурированный объект
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
            // Старый формат для обратной совместимости
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

      // Очищаем localStorage
      localStorage.removeItem('exams')
      localStorage.removeItem('currentExam')
      localStorage.removeItem('answerParams')
    }
  }
})
