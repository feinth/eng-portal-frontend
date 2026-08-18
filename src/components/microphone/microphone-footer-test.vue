<template>
  <div class="test-footer">
    <div class="footer-container">
      
      <!-- Левая часть: статус -->
      <div class="status-section">
        <q-icon 
          :name="statusIcon" 
          size="1.5rem" 
          :class="statusColorClass" 
        />
        <span class="status-label">{{ footerLabel }}</span>
      </div>

      <!-- Центральная часть: прогресс-бар с таймером -->
      <div class="progress-section">
        <div class="progress-wrapper">
          <q-linear-progress
            stripe
            size="28px"
            :value="timeLeft / timeout"
            :max="1"
            :color="progressColor"
            track-color="grey-3"
            class="custom-progress"
          >
            <div class="progress-content">
              <q-badge 
                color="white" 
                :text-color="badgeTextColor" 
                :label="countdown"
                class="time-badge"
              />
            </div>
          </q-linear-progress>
        </div>
      </div>

      <!-- Правая часть: кнопки действий -->
      <div class="action-section">
        
        <!-- Кнопка "Проверить микрофон" (когда нет записи) -->
        <q-btn
          v-if="!audioStore.isRecording && !audioStore.audioUrl"
          unelevated
          color="primary"
          label="Проверить микрофон"
          icon="sym_o_mic"
          no-caps
          @click="startRecord"
          class="action-btn"
        />

        <!-- Кнопка "Завершить проверку" (во время записи) -->
        <q-btn
          v-else-if="audioStore.isRecording"
          unelevated
          color="negative"
          label="Завершить проверку"
          icon="sym_o_stop"
          no-caps
          @click="stopRecord"
          class="action-btn stop-btn"
        />

        <!-- Кнопка "Прослушать" (после записи, когда не играет) -->
        <q-btn
          v-else-if="!audioStore.isRecording && audioStore.audioUrl && !isListening"
          unelevated
          color="primary"
          label="Прослушать"
          icon="sym_o_play_arrow"
          no-caps
          @click="startPlayAudio"
          class="action-btn"
        />

        <!-- Кнопка "Остановить" (когда играет аудио) -->
        <q-btn
          v-else-if="!audioStore.isRecording && audioStore.audioUrl && isListening"
          unelevated
          color="negative"
          label="Остановить"
          icon="sym_o_pause"
          no-caps
          @click="stopPlayAudio"
          class="action-btn"
        />

      </div>

    </div>
  </div>
</template>

<script>
import { useAudioStore } from '../../stores/audio.store'

export default {
  data() {
    return {
      timeLeft: 0,
      timer: null,
      currentAudioPlay: null,
      isListening: false,
      timeout: 20,
      type: 'prepare',
      audioStore: useAudioStore()
    }
  },
  computed: {
    countdown() {
      const remainingSeconds = this.timeout - this.timeLeft
      const minutes = Math.floor(remainingSeconds / 60)
      const seconds = remainingSeconds % 60
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    },
    footerLabel() {
      if (this.audioStore.isRecording) return 'Запись'
      if (this.isListening) return 'Прослушивание'
      if (this.audioStore.audioUrl) return 'Готово'
      return 'Подготовка'
    },
    statusIcon() {
      if (this.audioStore.isRecording) return 'sym_o_fiber_manual_record'
      if (this.isListening) return 'sym_o_graphic_eq'
      if (this.audioStore.audioUrl) return 'sym_o_check_circle'
      return 'sym_o_mic'
    },
    statusColorClass() {
      if (this.audioStore.isRecording) return 'text-negative'
      if (this.isListening) return 'text-warning'
      if (this.audioStore.audioUrl) return 'text-positive'
      return 'text-primary'
    },
    progressColor() {
      if (this.audioStore.isRecording) return 'negative'
      if (this.isListening) return 'warning'
      return 'primary'
    },
    badgeTextColor() {
      if (this.audioStore.isRecording) return 'negative'
      if (this.isListening) return 'warning'
      return 'primary'
    }
  },
  methods: {
    async startRecord() {
      this.timeLeft = 0
      this.type = 'record'
      
      try {
        await this.audioStore.startRecording()
        
        this.timer = setInterval(() => {
          this.timeLeft += 1
          if (this.timeLeft >= this.timeout) {
            this.stopRecord()
          }
        }, 1000)
      } catch (error) {
        this.$q.notify({
          message: 'Ошибка начала записи: ' + error.message,
          color: 'negative',
          icon: 'sym_o_warning'
        })
      }
    },
    
    async stopRecord() {
      clearInterval(this.timer)
      this.timer = null
      this.timeLeft = 0
      
      try {
        await this.audioStore.stopRecording()
        this.type = 'prepare'
      } catch (error) {
        this.$q.notify({
          message: 'Ошибка остановки записи',
          color: 'negative',
          icon: 'sym_o_warning'
        })
      }
    },
    
    startPlayAudio() {
      if (this.audioStore.audioUrl) {
        this.currentAudioPlay = new Audio(this.audioStore.audioUrl)
        
        this.isListening = true
        this.currentAudioPlay.play()
        
        this.currentAudioPlay.onended = () => {
          this.isListening = false
          this.currentAudioPlay = null
        }
      }
    },
    
    stopPlayAudio() {
      if (this.currentAudioPlay) {
        this.currentAudioPlay.pause()
        this.currentAudioPlay.currentTime = 0
        this.isListening = false
        this.currentAudioPlay = null
      }
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.currentAudioPlay) {
      this.currentAudioPlay.pause()
      this.currentAudioPlay = null
    }
  }
}
</script>

<style scoped>
/* Основной контейнер футера */
.test-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #FFFFFF;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
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
  min-width: 200px;
  display: flex;
  justify-content: flex-end;
}

/* Кнопки действий */
:deep(.action-btn) {
  border-radius: 12px !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 4px 12px rgba(124, 147, 195, 0.3) !important;
  padding: 8px 20px !important;
}

:deep(.action-btn:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 147, 195, 0.4) !important;
}

:deep(.action-btn:active) {
  transform: translateY(0);
}

/* Красная кнопка остановки записи */
:deep(.stop-btn) {
  box-shadow: 0 4px 12px rgba(255, 177, 167, 0.4) !important;
}

:deep(.stop-btn:hover) {
  box-shadow: 0 6px 20px rgba(255, 181, 167, 0.6) !important;
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

  :deep(.action-btn) {
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

  :deep(.action-btn) {
    font-size: 0.85rem !important;
    padding: 6px 12px !important;
  }
}
</style>