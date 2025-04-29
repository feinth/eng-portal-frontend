<template>
  <div class="timer-container">
    <p class="timer-header">{{ `Be ready for the ${type} ` }}</p>
    <div class="timer-countdown">
      <span class="timer-number">{{ timeLeft }}</span>
    </div>
    <p class="timer-footer">seconds</p>
  </div>
</template>

<script>
import { useAudioStore } from '../../stores/audio.store'
export default {
  props: {
    duration: {
      type: Number,
      default: 5 // По умолчанию 5 секунд
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
      audio: null,
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
            this.$emit('countdown-finished')
            this.audioStore.initAudioContext()
            await this.audioStore.fetchAndPlayAudio(this.audioSrc)
          } else {
            this.$emit('countdown-finished')
          }
        }
      }, 1000)
    }
  },
  mounted() {
    this.startCountdown()
  }
}
</script>

<style>
.countdown-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
}
.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.timer-header {
  font-size: 1.5em;
  margin-bottom: 20px;
}

.timer-countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3em;
  font-weight: bold;
}

.timer-number {
  font-size: 3em;
  font-weight: bold;
}

.timer-footer {
  font-size: 1.5em;
  margin-top: 10px;
}
</style>
