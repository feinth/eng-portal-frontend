<template>
  <div class="record-footer">
    <div class="footer-container">
      
      <!-- Левая часть: Кнопка записи -->
      <div class="action-section">
        <q-btn
          unelevated
          color="negative"
          icon="sym_o_mic"
          label="Запись"
          no-caps
          :disable="isRecording"
          class="record-btn-custom"
        />
      </div>

      <!-- Центральная часть: прогресс-бар с таймером -->
      <div class="progress-section">
        <div class="progress-wrapper">
          <q-linear-progress
            stripe
            size="28px"
            :value="timeLeft / timeout"
            :max="1"
            color="negative"
            track-color="grey-3"
            class="custom-progress"
          />
          
          <!-- Таймер поверх прогресс-бара (всегда виден) -->
          <div class="timer-overlay">
            <q-badge 
              color="white" 
              text-color="negative" 
              :label="countdown"
              class="time-badge"
            />
          </div>
        </div>
      </div>

      <!-- Правая часть: кнопка "Далее" -->
      <div class="action-section">
        <q-btn
          unelevated
          color="red"
          label="Далее"
          icon="sym_o_arrow_forward"
          no-caps
          @click="finish"
          :disable="isAudioPlaying"
          class="next-btn"
        />
      </div>

    </div>
  </div>
</template>

<script>
import { useExamStore } from '../../stores/exam.store'
import { useAudioStore } from '../../stores/audio.store'
import { storeToRefs } from 'pinia'
// Добавлен импорт Notify на случай, если он нужен для ошибки (был в вашем коде)
import { Notify } from 'quasar'

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
        await this.audioStore.startRecording()

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
        // Оставлено пустым, как в исходном коде
      }
    },

    async stopRecord() {
      clearInterval(this.timer)
      const audioBlob = await this.audioStore.stopRecording()

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

        if (!audioStore.audioContext) {
          audioStore.initAudioContext()
        }

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
  },
  beforeUnmount() {
    // Добавлен для очистки таймера при уничтожении компонента (хорошая практика из 1-го компонента)
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style scoped>
/* Основной контейнер футера (сохранен ваш цвет фона) */
.record-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgb(253, 211, 211);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 1000;
}

.footer-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Секция статуса (левая часть) */
.status-section {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

/* Секция прогресса */
.progress-section {
  flex: 1;
  max-width: 600px;
}

.progress-wrapper {
  position: relative;
  width: 100%;
}

/* Кастомный скругленный прогресс-бар */
:deep(.custom-progress) {
  border-radius: 14px !important;
  overflow: hidden;
}

:deep(.custom-progress .q-linear-progress__track) {
  border-radius: 14px !important;
}

/* Таймер поверх прогресс-бара */
.timer-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

/* Бейдж с таймером */
:deep(.time-badge) {
  font-weight: 700 !important;
  font-size: 1rem !important;
  padding: 6px 16px !important;
  border-radius: 20px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  background-color: #FFFFFF !important;
  color: var(--q-negative) !important; /* Красный текст в тон прогресс-бару */
}

/* Секция действий (правая часть) */
.action-section {
  min-width: 120px;
  display: flex;
  justify-content: flex-end;
}

/* Общие стили для скругленных кнопок (и "Запись", и "Далее") */
:deep(.record-btn-custom),
:deep(.next-btn) {
  border-radius: 12px !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 4px 12px rgba(255, 0, 0, 0.2) !important; /* Тень в тон negative */
  padding: 8px 20px !important;
}

:deep(.record-btn-custom:hover:not([disabled])),
:deep(.next-btn:hover:not([disabled])) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 0, 0, 0.3) !important;
}

:deep(.record-btn-custom:active:not([disabled])),
:deep(.next-btn:active:not([disabled])) {
  transform: translateY(0);
}

:deep(.record-btn-custom[disabled]),
:deep(.next-btn[disabled]) {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
}

/* Адаптивность */
@media (max-width: 768px) {
  .footer-container {
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }

  .status-section {
    min-width: auto;
  }

  .action-section {
    min-width: auto;
  }

  :deep(.record-btn-custom),
  :deep(.next-btn) {
    padding: 8px 16px !important;
  }
  
  :deep(.record-btn-custom .q-btn__content) {
    /* На мобильных можно оставить только иконку, если нужно, или оставить как есть */
  }

  .progress-section {
    max-width: none;
  }

  :deep(.time-badge) {
    font-size: 0.9rem !important;
    padding: 5px 14px !important;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0.625rem 0.75rem;
  }

  :deep(.time-badge) {
    font-size: 0.85rem !important;
    padding: 4px 12px !important;
  }
}
</style>