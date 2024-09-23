<template>
  <div class="fixed bottom-0 left-0 w-full border border-gray-300">
    <q-toolbar>
      <!-- иконка -->
      <div class="flex items-center">
        <div class="mr-4 flex items-center">
          <q-btn
            :color="buttonColor"
            icon="sym_o_mic"
            :label="buttonLabel"
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
          :color="buttonColor"
        >
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="black" :label="countdown" />
          </div>
        </q-linear-progress>
      </div>

      <!-- кнопка завершения -->
      <div class="flex items-center ml-4">
        <q-btn
          :color="buttonColor"
          @click="completeTask"
          :label="buttonLabelComplete"
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
    isRecording: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: Number,
      required: true
    },
    assignmentId: {
      type: Number,
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
      currentAudioPlay: null
    }
  },
  computed: {
    buttonColor() {
      return this.isRecording ? 'red' : 'blue' // Цвет кнопки в зависимости от режима
    },
    buttonLabel() {
      return this.isRecording ? 'Recording' : 'Preparation' // Лейбл кнопки
    },
    buttonLabelComplete() {
      return this.isRecording ? 'Завершить запись' : 'Завершить подготовку' // Лейбл завершения
    },
    countdown() {
      const remainingSeconds = this.timeout - this.timeLeft
      const minutes = Math.floor(remainingSeconds / 60)
      const seconds = remainingSeconds % 60
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }
  },
  methods: {
    startTimer() {
      this.timeLeft = 0
      this.timer = setInterval(() => {
        this.timeLeft += 1
        if (this.timeLeft >= this.timeout) {
          this.completeTask()
        }
      }, 1000)
    },
    completeTask() {
      clearInterval(this.timer)

      if (this.isRecording) {
        this.stopRecord() // Завершить запись
      } else {
        this.$emit('prepare-completed') // Завершить подготовку
      }
    },
    startRecord() {
      this.audioChunks = []
      this.audioUrl = null
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream)
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data)
        }
        this.mediaRecorder.start()
      })
    },
    stopRecord() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop()
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' })
          this.audioUrl = URL.createObjectURL(audioBlob)
          this.examStore.addAudioFile({
            taskId: this.taskId,
            assignmentId: this.assignmentId,
            audioUrl: this.audioUrl
          })
        }
      }
      this.$emit('record-completed')
    }
  },
  mounted() {
    this.startTimer()
    if (this.isRecording) {
      this.startRecord() // Запускаем запись, если это режим записи
    }
  }
}
</script>

<style scoped>
.fixed {
  position: fixed;
}

.bottom-0 {
  bottom: 0;
}

.left-0 {
  left: 0;
}

.w-full {
  width: 100%;
}

.border {
  border-style: solid;
}

.border-gray-300 {
  border-color: #d1d5db;
}
</style>
