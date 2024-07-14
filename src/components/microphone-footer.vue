<template>
  <div class="fixed bottom-0 left-0 w-full border border-gray-300">
    <q-toolbar>
      <div class="flex items-center">
        <div class="mr-4 flex items-center" v-if="!timeout">
          <q-btn
            :color="footerColor"
            icon="sym_o_mic"
            :label="footerLabel"
            no-caps
            class="w-32"
            @click="start"
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
          :color="footerColor"
        >
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="black" :label="countdown" />
          </div>
        </q-linear-progress>
      </div>

      <div class="flex items-center ml-4">
        <q-btn
          :color="footerColor"
          @click="stop"
          label="Завершить"
          no-caps
          class="w-32"
        />
      </div>
    </q-toolbar>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useUserStore } from '@/stores/user.store'

export default {
  props: {
    timeout: {
      type: Number,
      required: true,
      default: 60
    },
    type: {
      type: String,
      required: true
    },
    taskId: {
      type: String,
      required: false
    },
    assignmentId: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      timeLeft: 0,
      timer: null,
      mediaRecorder: null,
      audioChunks: []
    }
  },
  computed: {
    countdown() {
      const remainingSeconds = this.timeout - this.timeLeft
      const minutes = Math.floor(remainingSeconds / 60)
      const seconds = remainingSeconds % 60
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    },
    footerColor() {
      return this.type === 'prepare' ? 'blue' : 'red'
    },
    footerLabel() {
      return this.type === 'prepare' ? 'Preparation' : 'Recording'
    }
  },
  methods: {
    ...mapActions(useUserStore, ['addAudioFile']),
    start() {
      this.timeLeft = 0
      this.audioChunks = []
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream)
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data)
        }
        this.mediaRecorder.start()
      })

      this.timer = setInterval(() => {
        this.timeLeft += 1
        if (this.timeLeft >= this.timeout) {
          this.stop()
        }
      }, 1000)
    },
    stop() {
      clearInterval(this.timer)
      if (this.mediaRecorder) {
        this.mediaRecorder.stop()
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/mpeg' })
          const audioUrl = URL.createObjectURL(audioBlob)
          this.addAudioFile({
            taskId: this.taskId,
            assignmentId: this.assignmentId,
            audioBlob,
            audioUrl
          })
        }
      }
    }
  },
  mounted() {
    if (this.timeout) {
      this.start()
    }
  }
}
</script>

<style scoped>
.text-teal-700 {
  color: #285e61;
}

.text-teal-900 {
  color: #1c3d45;
}

.text-gray-800 {
  color: #2d3748;
}

.list-disc {
  list-style-type: disc;
}

.list-inside {
  list-style-position: inside;
}

.h-full {
  height: 100%;
}

.flex-grow {
  flex-grow: 1;
}
</style>
