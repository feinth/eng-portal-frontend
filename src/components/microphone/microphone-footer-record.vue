<template>
  <div class="fixed bottom-0 left-0 w-full border border-gray-300">
    <q-toolbar>
      <!-- иконка -->
      <div class="flex items-center">
        <div class="mr-4 flex items-center">
          <q-btn
            color="red"
            icon="sym_o_mic"
            label="Recording"
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
          color="red"
        >
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="black" :label="countdown" />
          </div>
        </q-linear-progress>
      </div>
      <!-- прогресс -->
      <div class="flex items-center ml-4">
        <q-btn
          color="red"
          @click="stopRecord"
          label="Завершить"
          no-caps
          class="w-32"
        />
      </div>
    </q-toolbar>
  </div>
</template>

<script>
import { useExamStore } from '../../stores/exam.store'

export default {
  props: {
    timeout: {
      type: Number,
      required: true,
      default: 60
    },
    taskId: {
      type: Number,
      required: true
    },
    assignmentId: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      timeLeft: 0,
      timer: null,
      mediaRecorder: null,
      audioChunks: [],
      audioUrl: null,
      examStore: useExamStore(),
      currentAudioPlay: null,
      isRecording: false
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
    startRecord() {
      this.timeLeft = 0
      this.audioChunks = []
      this.audioUrl = null
      this.isRecording = true
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
          this.stopRecord()
        }
      }, 1000)
    },
    stopRecord() {
      clearInterval(this.timer)
      if (this.mediaRecorder) {
        this.mediaRecorder.stop()
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' })
          this.audioUrl = URL.createObjectURL(audioBlob)
          this.isRecording = false
          this.examStore.addAudioFile({
            taskId: this.taskId,
            assignmentId: this.assignmentId,
            audioUrl: this.audioUrl
          })
        }
      }
      this.completeTask()
    },
    startPlayAudio() {
      if (this.audioUrl) {
        this.currentAudioPlay = new Audio(this.audioUrl)
        audio.play()
      }
    },
    stopPlayAudio() {
      if (this.currentAudioPlay) {
        this.currentAudioPlay.stop()
      }
    },
    completeTask() {
      this.$emit('record-completed')
    }
  },
  mounted() {
    this.startRecord()
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
