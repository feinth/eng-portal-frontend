<template>
  <div class="fixed-footer px-4">
    <q-toolbar>
      <!-- иконка -->
      <div class="flex items-center">
        <div class="mr-4 flex items-center">
          <q-btn
            color="blue"
            icon="sym_o_mic"
            label="Preparation"
            no-caps
            class="w-32"
          />
        </div>
      </div>

      <div class="flex-grow flex items-center justify-center">
        <q-linear-progress
          stripe
          class="q-my-md"
          size="25px"
          :value="timeLeft / timeout"
          :max="100"
          color="blue"
        >
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="black" :label="countdown" />
          </div>
        </q-linear-progress>
      </div>
      <!-- прогресс -->
      <div class="flex items-center ml-4">
        <q-btn
          color="blue"
          @click="stopPrepare"
          :disable="isAudioPlaying"
          label="Далее"
          no-caps
          class="w-32"
        />
      </div>
    </q-toolbar>
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
.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgb(232, 238, 255);
  border-top: 1px solid #ccc;
}
</style>
