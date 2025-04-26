<template>
  <div v-if="!checkedMicrophone" class="container mx-auto p-4">
    <div v-if="!microphonePermission">
      <h1 class="text-2xl text-center font-bold mb-4">Проверка микрофона</h1>
      <q-btn-group spread>

        <q-btn label="Разрешить доступ к микрофону" color="primary" @click="checkMicrophonePermission" />
      </q-btn-group>
    </div>
    <div v-else-if="microphonePermission">
      <p class="mb-4">
        Микрофон обнаружен! Сейчас будет производиться проверка микрофона.
      </p>
      <p class="mb-4">
        Нажмите кнопку записи внизу, произнесите несколько слов, остановите
        запись, затем попробуйте воспроизвести.
      </p>
      <p>Если вы уже делали это, можете сразу перейти к выполнению задания.</p>
      <q-btn-group spread>
        <q-btn color="red" label="Начать экзамен" no-caps class="flex justify-center full-width" @click="startExam" />
      </q-btn-group>
      <MicrophoneFooterTest :timeout="10" type="prepare" @stop="stopRecording" @start="startRecording" />
    </div>
    <div v-else>
      <p>Доступ к микрофону отклонен. Пожалуйста, предоставьте доступ для продолжения.</p>
      <q-btn label="Попробовать снова" color="secondary" @click="checkMicrophonePermission" />
    </div>
  </div>
  <div class="container mx-auto p-4" v-if="checkedMicrophone">
    <q-inner-loading v-if="examStarted && !examData && !audioGuidance" :showing="!examData"
      label="Идет загрузка заданий..." />
    <div v-else>
      <div v-if="currentTaskComponent">
        <component v-show="!createdAnswerData" :is="currentTaskComponent" :task="currentTask" @next-task="nextTask" />
      </div>
    </div>
  </div>

  <q-inner-loading v-if="createdAnswerData && !createdArchiveUrl" :showing="!createdArchiveUrl"
    label="Сохранение задания, пожалуйста, подождите..." />
  <div v-if="createdArchiveUrl">
    <q-card>
      <q-card-section class="bg-gray-100 text-center">
        <div class="text-h6">
          Поздравляем! Ваш тест закончен.
          <br />
          Сохранить результаты можно, нажав на кнопку ниже.
          Запись доступна по данной ссылке ограниченное время (от нескольких часов до нескольких дней).
          <br />
          Если Вы планируете использовать запись позже, то Вы можете её скачать по ссылке.
          <br />
          <a :href="urlForDownload" target="_blank" class="highlighted-link">
            {{ urlForDownload }}
          </a>
        </div>

        <!-- Блок с кнопкой и аудио -->
        <div class="centered-actions q-mt-md">
          <!-- Кнопка "Скачать результаты" -->
          <q-btn flat color="primary" @click="loadAnswers()" icon="cloud_upload" label="Скачать результаты"
            class="full-width q-mb-md" />

          <!-- Аудио-плеер -->
          <div class="audio-section">
            <p class="text-h5 text-center q-mb-sm">Прослушайте вашу запись:</p>
            <audio controls class="q-mx-auto">
              <source :src="createdAnswerData?.full_audio" type="audio/mpeg" />
              Ваш браузер не поддерживает аудио элемент.
            </audio>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div v-for="(task, index) in completedTasks" :key="index"
      class="my-8 bg-gray-100 rounded-lg shadow-md p-6 flex items-center">
      <component :is="getTaskContent(task)" :task="task" />
    </div>
  </div>



</template>

<script>
import Task1 from '../components/tasks/task-1.vue'
import Task2 from '../components/tasks/task-2.vue'
import Task3 from '../components/tasks/task-3.vue'
import Task4 from '../components/tasks/task-4.vue'

import Task1Content from '../components/tasks/Task1Content.vue'
import Task2Content from '../components/tasks/Task2Content.vue'
import Task3Content from '../components/tasks/Task3Content.vue'
import Task4Content from '../components/tasks/Task4Content.vue'
import { useExamStore } from '../stores/exam.store'
import MicrophoneFooterTest from '../components/microphone/microphone-footer-test.vue'

export default {
  components: {
    Task1,
    Task2,
    Task3,
    Task4,
    Task1Content,
    Task2Content,
    Task3Content,
    Task4Content,
    MicrophoneFooterTest
  },
  data() {
    return {
      currentTaskIndex: 0,
      examData: null,
      audioGuidance: null,
      examStore: useExamStore(),
      savingTask: null,
      createdAnswerData: null,
      examStarted: false,
      completedTasks: [],
      microphonePermission: false,
      checkedMicrophone: false,
      mediaRecorder: null,
      audioChunks: [],
      audioBlob: null,
      audioUrl: null
    }
  },
  computed: {
    currentTask() {
      return this.examData?.[this.currentTaskIndex] || null
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
    },
    urlForDownload() {
      const originalUrl = this.createdAnswerData?.answer_archive;
      const newBaseUrl = "https://english-portal.ru/media";

      // Разделяем строку по "/media" и собираем её заново с новым базовым URL
      const updatedUrl = `${newBaseUrl}${originalUrl.split('/media').pop()}`;
      return updatedUrl;
    }
  },
  methods: {
    startExam() {
      this.checkedMicrophone = true
      this.examStarted = true
      this.examStore.taskAnswers = []

      this.examStore.getAudioGuidance().then((response) => {
        this.audioGuidance = response
      })
      this.examData = this.examStore.currentExam.sort((a, b) => a.type - b.type)
    },
    playEndAudio() {
      const audio = new Audio(this.audioGuidance.end_exam_audio)
      audio.play()
    },
    nextTask() {
      if (!this.completedTasks.includes(this.currentTask)) {
        this.completedTasks.push(this.currentTask)
      }
      if (this.currentTaskIndex < this.examData.length - 1) {
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
        link.href = archiveUrl // Устанавливаем URL для скачивания
        link.download = '' // Имя файла можно оставить пустым, если сервер сам возвращает имя файла
        link.target = '_blank' // Открыть ссылку в новом окне/вкладке, если нужно

        // Программно кликаем по ссылке для начала скачивания
        document.body.appendChild(link)
        link.click()

        // Удаляем элемент <a> после клика
        document.body.removeChild(link)
      }
    },
    getTaskContent(task) {
      if (!task) return null
      switch (task.type) {
        case 1: return 'Task1Content'
        case 2: return 'Task2Content'
        case 3: return 'Task3Content'
        case 4: return 'Task4Content'
        default: return null
      }
    },
    async checkMicrophonePermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        this.microphonePermission = true
        stream.getTracks().forEach(track => track.stop())
      } catch (e) {
        this.$q.notify({
          message: 'Доступ к микрофону отклонен',
          color: 'negative'
        })
      }
    },
    startRecording() {
      this.audioChunks = []
      this.mediaRecorder = new MediaRecorder(stream)
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data)
      }
      this.mediaRecorder.start()
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop()
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/mpeg' })
          this.audioUrl = URL.createObjectURL(this.audioBlob)
        }
      }
    },
  },
}
</script>

<style scoped>
.highlighted-link {
  color: #1976d2;
  /* Цвет ссылки (синий) */
  font-weight: bold;
  /* Жирный шрифт */
  text-decoration: underline;
  /* Подчеркивание */
  word-break: break-all;
  /* Перенос длинных ссылок */
}

/* При наведении мыши */
.highlighted-link:hover {
  color: #0056b3;
  /* Темнее синий при наведении */
  text-decoration: none;
  /* Убираем подчеркивание при наведении */
}

.audio-section {
  text-align: center;
  width: 100%;
  /* Растягиваем на всю ширину */
  max-width: 100%;
  /* Ограничиваем максимальную ширину */
  margin: 0 auto;
  /* Центрируем, если нужно */
}

.audio-section audio {
  width: 100%;
  /* Растягиваем аудио-плеер на всю ширину */
}
</style>