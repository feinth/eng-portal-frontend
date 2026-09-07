<template>
  <div class="timer-overlay">
    <div class="timer-card">
      <p class="timer-header">
        Be ready for the {{ type }}
      </p>

      <div class="timer-circle">
        <span class="timer-number" :class="{ 'pulse': timeLeft <= 3 }">
          {{ timeLeft }}
        </span>
      </div>

      <p class="timer-footer">seconds</p>
    </div>
  </div>
</template>

<script>
import { useAudioStore } from '../../stores/audio.store'

export default {
  name: 'Timer',
  props: {
    duration: {
      type: Number,
      default: 5
    },
    audioSrc: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      timeLeft: this.duration,
      audioStore: useAudioStore()
    }
  },
  methods: {
    async startCountdown() {
      const countdown = setInterval(async () => {
        this.timeLeft--

        if (this.timeLeft <= 0) {
          clearInterval(countdown)

          await this.audioStore.playIntroAudio()
          if (this.audioSrc) {
            this.audioStore.initAudioContext()
            await this.audioStore.fetchAndPlayAudio(this.audioSrc)
          }
          this.$emit('countdown-finished')
        }
      }, 1000)
    }
  },
  mounted() {
    this.startCountdown()
  }
}
</script>

<style scoped>
.timer-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  z-index: 9999;
  padding: 1rem;
}

.timer-card {
  background: white;
  border-radius: 28px;
  padding: 2.5rem 3.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.timer-header {
  font-size: 1.25rem;
  font-weight: 500;
  color: #2B2D42;
  margin: 0 0 1.5rem;
  text-align: center;
}

.timer-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EEF3FB 0%, #E1EAF8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8px 24px rgba(124, 147, 195, 0.3),
    inset 0 2px 8px rgba(255, 255, 255, 0.8);
  border: 4px solid white;
}

.timer-number {
  font-size: 4.5rem;
  font-weight: 800;
  color: var(--q-primary);
  line-height: 1;
  transition: transform 0.3s ease, color 0.3s ease;
}

.timer-number.pulse {
  color: #EF5350;
  animation: pulseBeat 1s ease-in-out infinite;
}

@keyframes pulseBeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.timer-footer {
  font-size: 1rem;
  font-weight: 500;
  color: #8A94A6;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 1.25rem 0 0;
}

/* Адаптивность для мобильных */
@media (max-width: 480px) {
  .timer-card {
    padding: 2rem 2rem;
    min-width: auto;
    width: 100%;
    max-width: 320px;
  }

  .timer-circle {
    width: 130px;
    height: 130px;
  }

  .timer-number {
    font-size: 3.5rem;
  }

  .timer-header {
    font-size: 1.1rem;
  }
}
</style>