<template>
  <q-page class="q-pa-md md:q-pa-lg">
    <div class="max-w-5xl mx-auto">

      <!-- ЭКРАН 1: Проверка микрофона -->
      <div v-if="!checkedMicrophone">

        <!-- Запрос разрешения -->
        <div v-if="!microphonePermission" class="microphone-check-card">
          <q-card>
            <q-card-section class="text-center q-pa-xl">
              <q-icon name="sym_o_mic" size="4rem" class="text-primary q-mb-lg" />
              <h1 class="text-h5 text-weight-bold text-grey-9 q-mb-md">
                Проверка микрофона
              </h1>
              <p class="text-body1 text-grey-7 q-mb-lg">
                Для прохождения экзамена необходим доступ к микрофону.
                Пожалуйста, разрешите доступ, чтобы продолжить.
              </p>
              <q-btn unelevated color="primary" label="Разрешить доступ к микрофону" icon="sym_o_mic" size="lg"
                class="permission-btn" @click="checkMicrophonePermission" />
            </q-card-section>
          </q-card>
        </div>

        <!-- Микрофон разрешен -->
        <div v-else class="microphone-check-card">
          <q-card>
            <q-card-section class="q-pa-xl">
              <div class="instructions q-mb-lg">
                <div class="instruction-step">
                  <q-icon name="sym_o_radio_button_checked" color="primary" />
                  <span>Нажмите кнопку записи внизу экрана</span>
                </div>
                <div class="instruction-step">
                  <q-icon name="sym_o_radio_button_checked" color="primary" />
                  <span>Произнесите несколько слов</span>
                </div>
                <div class="instruction-step">
                  <q-icon name="sym_o_radio_button_checked" color="primary" />
                  <span>Остановите запись и воспроизведите её</span>
                </div>
              </div>

              <q-banner class="info-banner q-mb-lg" rounded>
                <template v-slot:avatar>
                  <q-icon name="sym_o_info" color="primary" />
                </template>
                Если вы уже проверяли микрофон, можете сразу начать экзамен.
              </q-banner>

              <q-btn unelevated color="primary" label="Начать экзамен" icon="sym_o_play_arrow" size="lg"
                class="start-exam-btn full-width" @click="startExam" />
            </q-card-section>
          </q-card>

          <!-- Компонент теста микрофона -->
          <div class="q-mt-lg">
            <MicrophoneFooterTest :timeout="10" type="prepare" @stop="stopRecording" @start="startRecording" />
          </div>
        </div>
      </div>

      <!-- ЭКРАН 2: Процесс экзамена -->
      <div v-if="checkedMicrophone" class="exam-container">

        <!-- Индикатор загрузки -->
        <q-inner-loading v-if="examStarted && !examData && !audioGuidance" :showing="!examData"
          label="Идет загрузка заданий..." label-class="text-grey-7" />

        <!-- Текущее задание -->
        <div v-else-if="currentTaskComponent">
          <component v-show="!createdAnswerData" :is="currentTaskComponent" :task="currentTask" @next-task="nextTask" />
        </div>
      </div>

      <!-- ЭКРАН 3: Сохранение результатов -->
      <q-inner-loading v-if="createdAnswerData && !createdArchiveUrl" :showing="!createdArchiveUrl"
        label="Сохранение задания, пожалуйста, подождите..." label-class="text-grey-7" />

      <!-- ЭКРАН 4: Результаты экзамена -->
      <div v-if="createdArchiveUrl" class="results-container">

        <!-- Карточка поздравления -->
        <q-card class="congratulations-card q-mb-xl">
          <q-card-section class="q-pa-xl text-center">
            <q-icon name="sym_o_celebration" size="5rem" color="positive" class="q-mb-lg" />
            <h2 class="text-h4 text-weight-bold text-grey-9 q-mb-md">
              Поздравляем!
            </h2>
            <p class="text-h6 text-grey-7 q-mb-lg">
              Ваш экзамен успешно завершен
            </p>

            <div class="download-info q-mb-lg">
              <p class="text-body2 text-grey-6">
                Сохраните результаты, нажав на кнопку ниже. Запись доступна
                ограниченное время (от нескольких часов до нескольких дней).
              </p>
            </div>

            <!-- Кнопка скачивания -->
            <q-btn unelevated color="primary" label="Скачать результаты" icon="sym_o_download" size="lg"
              class="download-btn full-width q-mb-lg" @click="loadAnswers()" />

            <!-- Ссылка для скачивания -->
            <div class="download-link-section q-mb-lg">
              <p class="text-caption text-grey-6 q-mb-xs">Прямая ссылка:</p>
              <a :href="urlForDownload" target="_blank" class="download-link">
                {{ urlForDownload }}
              </a>
            </div>

            <!-- Аудио плеер -->
            <div class="audio-player-section">
              <h3 class="text-h6 text-weight-medium text-grey-8 q-mb-md">
                Прослушайте вашу запись
              </h3>
              <div class="audio-wrapper">
                <audio controls class="custom-audio">
                  <source :src="createdAnswerData?.full_audio" type="audio/mpeg" />
                  Ваш браузер не поддерживает аудио элемент.
                </audio>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Список выполненных заданий -->
        <div class="completed-tasks-section">
          <h3 class="text-h5 text-weight-bold text-grey-9 q-mb-lg">
            Ваш вариант
          </h3>
          <div class="tasks-grid">
            <q-card v-for="(task, index) in completedTasks" :key="index" class="completed-task-card">
              <q-card-section>
                <component :is="getTaskContent(task)" :task="task" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

    </div>
  </q-page>
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
import { useAudioStore } from '../stores/audio.store'

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
      audioStore: useAudioStore(),
      savingTask: null,
      createdAnswerData: null,
      errorMicrophonePermission: false,
      examStarted: false,
      completedTasks: [],
      microphonePermission: false,
      checkedMicrophone: false,
      audioChunks: [],
      audioBlob: null
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
      const originalUrl = this.createdAnswerData?.answer_archive
      const newBaseUrl = 'https://englishportal.ru/media'

      const updatedUrl = `${newBaseUrl}${originalUrl.split('/media').pop()}`
      return updatedUrl
    },
    isRecording() {
      return this.audioStore.isRecording
    },
    audioUrl() {
      return this.audioStore.audioUrl
    }
  },
  methods: {
    async startExam() {
      // ← Разблокируем аудио СИНХРОННО в момент клика
      this.audioStore.unlockAudio()

      this.checkedMicrophone = true
      this.examStarted = true
      this.examStore.taskAnswers = []

      this.examData = this.examStore.currentExam.sort((a, b) => a.type - b.type)
    },
    playEndAudio() {
      if (!this.audioStore.audioContext) {
        this.audioStore.initAudioContext()
      }

      this.audioStore.fetchAndPlayAudio(this.audioGuidance?.end_exam_audio)
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
      trackGoal('exam_finished')
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
      const archiveUrl = this.createdArchiveUrl

      if (archiveUrl) {
        const link = document.createElement('a')
        link.href = archiveUrl
        link.download = ''
        link.target = '_blank'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },
    getTaskContent(task) {
      if (!task) return null
      switch (task.type) {
        case 1:
          return 'Task1Content'
        case 2:
          return 'Task2Content'
        case 3:
          return 'Task3Content'
        case 4:
          return 'Task4Content'
        default:
          return null
      }
    },
    async checkMicrophonePermission() {
      // Разблокируем аудио
      this.audioStore.unlockAudio()

      try {
        this.microphonePermission = await this.audioStore.initRecorder()

        if (!this.audioStore.audioContext) {
          this.audioStore.initAudioContext()
        }

        // ← ВАЖНО: предзагружаем audioGuidance И intro аудио в память
        await this.audioStore.preloadAudioGuidance()

      } catch (e) {
        this.$q.notify({
          message: 'Доступ к микрофону отклонен',
          color: 'negative'
        })
      }
    },
    async startRecording() {
      try {
        await this.audioStore.startRecording()
      } catch (err) {
        this.$q.notify({
          message: 'Ошибка начала записи: ' + err.message,
          color: 'negative'
        })
      }
    },
    async stopRecording() {
      try {
        await this.audioStore.stopRecording()

        if (this.audioStore.audioBlob) {
          const audioBase64 = await this.blobToBase64(this.audioStore.audioBlob)
          this.examStore.addAudioFile({
            taskId: this.taskId,
            assignmentId: this.assignmentId,
            audioUrl: this.audioStore.audioUrl,
            audioBase64: audioBase64
          })
        }
      } catch (err) {
        this.$q.notify({
          message: 'Ошибка остановки записи: ' + err.message,
          color: 'negative'
        })
      }
    },
    blobToBase64(blob) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(blob)
      })
    }
  }
}
</script>

<style scoped>
/* Карточка проверки микрофона */
.microphone-check-card :deep(.q-card) {
  border-radius: 20px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

/* Шаги инструкций - ИСПРАВЛЕНО ЦЕНТРИРОВАНИЕ */
.instructions {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.instruction-step {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: #F8F9FA;
  border-radius: 12px;
  font-size: 1rem;
  color: #2B2D42;
  text-align: left;
}

.instruction-step span {
  flex: 1;
  text-align: left;
}

/* Информационный баннер */
:deep(.info-banner) {
  background-color: #E3F2FD !important;
  border: 1px solid #90CAF9 !important;
}

/* Кнопки */
:deep(.permission-btn),
:deep(.start-exam-btn),
:deep(.download-btn) {
  border-radius: 12px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 4px 12px rgba(124, 147, 195, 0.3) !important;
}

:deep(.permission-btn:hover),
:deep(.start-exam-btn:hover),
:deep(.download-btn:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 147, 195, 0.4) !important;
}

/* Карточка результатов */
:deep(.congratulations-card) {
  border-radius: 20px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

/* Ссылка для скачивания */
.download-link-section {
  padding: 16px;
  background-color: #F8F9FA;
  border-radius: 12px;
}

.download-link {
  color: var(--q-primary) !important;
  font-weight: 500;
  word-break: break-all;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.download-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

/* Аудио плеер */
.audio-player-section {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #E0E0E0;
}

.audio-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.custom-audio {
  width: 100%;
  border-radius: 12px;
  outline: none;
}

/* Секция выполненных заданий */
.completed-tasks-section {
  margin-top: 48px;
}

.tasks-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

:deep(.completed-task-card) {
  border-radius: 16px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

/* Адаптивность */
@media (max-width: 768px) {

  .microphone-check-card :deep(.q-card),
  :deep(.congratulations-card) {
    border-radius: 16px !important;
  }

  :deep(.q-pa-xl) {
    padding: 1.5rem !important;
  }

  .text-h4 {
    font-size: 1.5rem !important;
  }

  .text-h5 {
    font-size: 1.3rem !important;
  }

  .instruction-step {
    font-size: 0.9rem;
    padding: 10px 12px;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  :deep(.q-pa-xl) {
    padding: 1rem !important;
  }

  .instruction-step {
    font-size: 0.85rem;
    gap: 8px;
    flex-direction: row;
  }

  .instruction-step span {
    font-size: 0.85rem;
  }
}
</style>