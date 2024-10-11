<template>
  <q-inner-loading
    v-if="!examData"
    :showing="!examData"
    label="Идет загрузка заданий..."
  />
  <div v-else>
    <div v-if="currentTaskComponent">
      <!-- Отображение текущего задания -->
      <component
        v-show="!createdAnswerData"
        :is="currentTaskComponent"
        :task="currentTask"
        @next-task="nextTask"
      />
    </div>
  </div>

  <q-inner-loading
    v-if="createdAnswerData && !createdArchiveUrl"
    :showing="!createdArchiveUrl"
    label="Сохранение задания, пожалуйста, подождите..."
  />

  <q-card v-if="createdArchiveUrl">
    <q-card-section class="bg-teal-6 text-white">
      <div class="text-h6">
        Поздравляем!
        <br />
        Ваш тест закончен. Сохранить результаты можно, нажав на кнопку ниже.
        Запись доступна по данной ссылке ограниченное время (от нескольких часов
        до нескольких дней). Если Вы планируете использовать запись позже, то Вы
        можете её скачать.
      </div>
    </q-card-section>

    <q-card-actions vertical align="center">
      <q-btn
        flat
        color="teal-8"
        @click="loadAnswers()"
        icon="cloud_upload"
        style="width: 100px"
        >Сохранить результаты</q-btn
      >
    </q-card-actions>
  </q-card>
</template>

<script>
import Task1 from '../components/tasks/task-1.vue'
import Task2 from '../components/tasks/task-2.vue'
import Task3 from '../components/tasks/task-3.vue'
import Task4 from '../components/tasks/task-4.vue'
import { useExamStore } from '../stores/exam.store'

export default {
  components: {
    Task1,
    Task2,
    Task3,
    Task4
  },
  data() {
    return {
      currentTaskIndex: 0,
      examData: null,
      examStore: useExamStore(),
      savingTask: null,
      createdAnswerData: false
    }
  },
  computed: {
    currentTask() {
      return this.examData?.tasks[this.currentTaskIndex] || null
    },
    currentTaskComponent() {
      switch (this.currentTask?.type) {
        case 1:
          return 'Task1'
        case 2:
          return 'Task2'
        case 3:
          return 'Task3'
        case 4:
          return 'Task4'
        default:
          return null
      }
    },
    createdArchiveUrl() {
      return this.createdAnswerData?.answer_archive
    }
  },
  methods: {
    startExam() {
      const examData = this.examStore.currentExam
      if (examData && examData.tasks && examData.tasks.length > 0) {
        this.examStore.taskAnswers = []
        this.examData = examData
        this.playIntroAudio()
      }
    },
    playIntroAudio() {
      const audio = new Audio(
        'http://localhost:80' + this.examData.begin_audio_guidance
      )
      audio.play()
    },
    playEndAudio() {
      const audio = new Audio(
        'http://localhost:80' + this.examData.end_audio_guidance
      )
      audio.play()
    },
    nextTask() {
      if (this.currentTaskIndex < this.examData.tasks.length - 1) {
        this.currentTaskIndex++
      } else {
        this.finishExam()
      }
    },
    finishExam() {
      this.playEndAudio()
      this.currentTaskIndex++
      this.examStore.setExamAnswers().then((result) => {
        this.createdAnswerData = result
        this.pollForAnswerArchive(this.createdAnswerData.id)
      })
    },
    saveAnswers() {
      this.currentTaskIndex = 3
    },
    pollForAnswerArchive(id) {
      this.pollingInterval = setInterval(async () => {
        this.examStore.getExamAnswers(id).then((result) => {
          this.createdAnswerData = result
          if (this.createdArchiveUrl) {
            clearInterval(this.pollingInterval)
          }
        })
      }, 1000)
    },
    loadAnswers() {
      const archiveUrl = this.createdArchiveUrl // URL архива, который возвращает API

      if (archiveUrl) {
        // Создаем временный элемент <a>
        const link = document.createElement('a')
        link.href = 'http://localhost:80' + archiveUrl // Устанавливаем URL для скачивания
        link.download = '' // Имя файла можно оставить пустым, если сервер сам возвращает имя файла
        link.target = '_blank' // Открыть ссылку в новом окне/вкладке, если нужно

        // Программно кликаем по ссылке для начала скачивания
        document.body.appendChild(link)
        link.click()

        // Удаляем элемент <a> после клика
        document.body.removeChild(link)
      }
    }
  },
  mounted() {
    this.startExam()
  }
}
</script>

<style scoped></style>
