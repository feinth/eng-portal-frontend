<template>
  <div class="fixed-footer px-4">
    <q-toolbar>
      <!-- Иконка микрофона -->
      <div class="flex items-center">
        <div class="mr-4 flex items-center">
          <q-btn color="red" icon="sym_o_mic" label="Recording" no-caps class="w-32" />
        </div>
      </div>

      <!-- Прогресс-бар -->
      <div class="flex-grow flex items-center justify-center">
        <q-linear-progress stripe class="q-my-md" size="25px" :value="timeLeft / timeout" :max="100" color="red">
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="black" :label="countdown" />
          </div>
        </q-linear-progress>
      </div>

      <!-- Кнопка "Далее" -->
      <div class="flex items-center ml-4">
        <q-btn color="red" @click="finish" label="Далее" no-caps class="w-32" :disable="isAudioPlaying" />
      </div>
    </q-toolbar>
  </div>
</template>

<script>
import { useExamStore } from '../../stores/exam.store'
import { useAudioStore } from '../../stores/audio.store' // Импортируем Pinia-хранилище
import { storeToRefs } from 'pinia'

export default {
  props: {
    timeout: { type: Number, default: 60 },
    taskId: { type: Number, required: true },
    assignmentId: { type: Number, default: null },
    audioBeforeSource: { type: String, default: null },
    betweenQuestionAudio: { type: String, default: null }
  },
  setup() {
    const audioStore = useAudioStore()
    const examStore = useExamStore()
    const { audioUrl, isRecording } = storeToRefs(audioStore)

    return {
      audioStore,
      examStore,
      audioUrl,
      isRecording
    }
  },
  data() {
    return {
      timeLeft: 0,
      timer: null,
      currentAudioPlay: null,
      isAudioPlaying: false
    }
  },
  computed: {
    countdown() {
      const remainingSeconds = this.timeout - this.timeLeft
      const minutes = Math.floor(remainingSeconds / 60)
      const seconds = remainingSeconds % 60
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }
  },
  methods: {
    async startRecord() {
      try {
        this.timeLeft = 0
        await this.audioStore.startRecording() // Используем метод из хранилища

        this.timer = setInterval(() => {
          this.timeLeft += 1
          if (this.timeLeft >= this.timeout) {
            this.finish()
          }
        }, 1000)
      } catch (error) {
        this.$q.notify({
          message: 'Не удалось начать запись',
          color: 'negative'
        })
      }
    },

    async finish() {
      try {
        await this.stopRecord()
        this.completeTask()
      } catch (error) {
      }
    },

    async stopRecord() {
      clearInterval(this.timer)
      const audioBlob = await this.audioStore.stopRecording() // Получаем Blob из хранилища

      // Конвертируем в base64 и сохраняем
      const audioBase64 = await this.blobToBase64(audioBlob)
      this.examStore.addAudioFile({
        taskId: this.taskId,
        assignmentId: this.assignmentId,
        audioUrl: this.audioUrl,
        audioBase64: audioBase64
      })
    },

    completeTask() {
      this.$emit('record-completed')
    },

    async startPlayAudioBefore() {
      if (!this.audioBeforeSource) {
        this.startRecord()
        return
      }

      const audioStore = useAudioStore()

      try {
        this.isAudioPlaying = true

        // Инициализируем AudioContext (если ещё не был инициализирован)
        if (!audioStore.audioContext) {
          audioStore.initAudioContext()
        }

        // Функция для последовательного воспроизведения аудио
        const playSequence = async () => {
          if (this.betweenQuestionAudio) {
            await audioStore.fetchAndPlayAudio(this.betweenQuestionAudio)
            await audioStore.fetchAndPlayAudio(this.audioBeforeSource)
            await audioStore.fetchAndPlayAudio(this.betweenQuestionAudio)
          } else {
            await audioStore.fetchAndPlayAudio(this.audioBeforeSource)
          }
        }

        await playSequence()
      } catch (error) {
        Notify.create({
          message: 'Ошибка воспроизведения аудио',
          color: 'negative'
        })
      } finally {
        this.isAudioPlaying = false
        this.startRecord()
      }
    },

    blobToBase64(blob) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(blob)
      })
    }
  },
  mounted() {
    this.startPlayAudioBefore()
  }
}
</script>

<style scoped>
.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgb(253, 211, 211);
  border-top: 1px solid #ccc;
}
</style>
