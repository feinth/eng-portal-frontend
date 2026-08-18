<template>
  <div class="prepare-footer">
    <div class="footer-container">
      
      <!-- Левая часть: статус подготовки -->
      <div class="status-section">
        <q-icon 
          name="sym_o_mic" 
          size="1.5rem" 
          class="text-primary" 
        />
        <span class="status-label">Подготовка</span>
      </div>

      <!-- Центральная часть: прогресс-бар с таймером -->
      <div class="progress-section">
        <div class="progress-wrapper">
          <q-linear-progress
            stripe
            size="28px"
            :value="timeLeft / timeout"
            :max="1"
            color="primary"
            track-color="grey-3"
            class="custom-progress"
          >
            <div class="progress-content">
              <q-badge 
                color="white" 
                text-color="primary" 
                :label="countdown"
                class="time-badge"
              />
            </div>
          </q-linear-progress>
        </div>
      </div>

      <!-- Правая часть: кнопка "Далее" -->
      <div class="action-section">
        <q-btn
          unelevated
          color="primary"
          label="Далее"
          icon="sym_o_arrow_forward"
          no-caps
          @click="stopPrepare"
          :disable="isAudioPlaying"
          class="next-btn"
        />
      </div>

    </div>
  </div>
</template>

<script>
import { useAudioStore } from '../../stores/audio.store'

export default {
  props: {
    timeout: {
      type: Number,
      required: true,
      default: 60
    },
    audioSrc: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      timeLeft: 0,
      timer: null,
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
    startPrepare() {
      this.timeLeft = 0
      this.timer = setInterval(() => {
        this.timeLeft += 1
        if (this.timeLeft >= this.timeout) {
          this.stopPrepare()
        }
      }, 1000)
    },
    stopPrepare() {
      clearInterval(this.timer)
      this.completeTask()
    },
    completeTask() {
      this.$emit('prepare-completed')
    },
    async startPlayAudioBefore() {
      if (!this.audioSrc) {
        this.startPrepare()
        return
      }

      const audioStore = useAudioStore()

      try {
        if (!audioStore.audioContext) {
          audioStore.initAudioContext()
        }

        this.isAudioPlaying = true
        await audioStore.fetchAndPlayAudio(this.audioSrc)
      } catch (error) {
      } finally {
        this.isAudioPlaying = false
        this.startPrepare()
      }
    }
  },
  mounted() {
    this.startPlayAudioBefore()
  }
}
</script>

<style scoped>
/* Основной контейнер футера */
.prepare-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #e4f3fb;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.08);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 1000;
}

.footer-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Секция статуса */
.status-section {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
}

.status-label {
  font-weight: 600;
  font-size: 1rem;
  color: #2B2D42;
}

/* Секция прогресса */
.progress-section {
  flex: 1;
  max-width: 600px;
}

.progress-wrapper {
  width: 100%;
}

/* Кастомный прогресс-бар */
:deep(.custom-progress) {
  border-radius: 14px !important;
  overflow: hidden;
}

:deep(.custom-progress .q-linear-progress__track) {
  border-radius: 14px !important;
}

.progress-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Бейдж с таймером */
:deep(.time-badge) {
  font-weight: 700 !important;
  font-size: 0.95rem !important;
  padding: 4px 12px !important;
  border-radius: 20px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

/* Секция действий */
.action-section {
  min-width: 140px;
  display: flex;
  justify-content: flex-end;
}

/* Кнопка "Далее" */
:deep(.next-btn) {
  border-radius: 12px !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 4px 12px rgba(124, 147, 195, 0.3) !important;
  padding: 8px 20px !important;
}

:deep(.next-btn:hover:not([disabled])) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 147, 195, 0.4) !important;
}

:deep(.next-btn:active:not([disabled])) {
  transform: translateY(0);
}

:deep(.next-btn[disabled]) {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

/* Адаптивность */
@media (max-width: 768px) {
  .footer-container {
    padding: 0.875rem 1rem;
    gap: 0.75rem;
  }

  .status-section {
    min-width: auto;
  }

  .status-label {
    display: none;
  }

  .action-section {
    min-width: auto;
  }

  :deep(.next-btn) {
    padding: 8px 16px !important;
  }

  .progress-section {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0.75rem;
  }

  :deep(.time-badge) {
    font-size: 0.85rem !important;
    padding: 3px 10px !important;
  }
}
</style>