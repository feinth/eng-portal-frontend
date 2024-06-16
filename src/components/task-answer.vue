<template>
  <div
    v-if="beforeTaskTimer > 0"
    class="countdown-container flex flex-col items-center justify-center h-screen"
  >
    <p class="mt-2 text-center">Be ready for the answer</p>

    <p class="font-bold text-center">{{ beforeTaskTimer }}</p>

    <p class="mt-2 text-center">seconds</p>
  </div>
  <div v-else>
    <div class="p-4">
      <TaskView :task="task" />
    </div>
    <TaskFooter
      :timeout="task.recordTimeout"
      type="record"
      @start="startRecording"
      @stop="stopRecording"
    />
  </div>
</template>

<script>
import TaskFooter from './task-footer.vue'
import TaskView from './task-view.vue'
export default {
  components: {
    TaskFooter,
    TaskView
  },
  data() {
    return {
      mediaRecorder: null,
      recordedChunks: [],
      audioUrl: null,
      progress: 0,
      beforeTaskTimer: 5
    }
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  methods: {
    startRecording() {
      navigator.mediaDevices
        .getUserMedia({
          audio: true
        })
        .then((stream) => {
          this.recordedChunks = []
          this.mediaRecorder = new MediaRecorder(stream)

          this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              this.recordedChunks.push(e.data)
            }
          }

          this.mediaRecorder.onstop = () => {
            let blob = new Blob(this.recordedChunks, { type: 'audio/mp3' })
            this.audioUrl = URL.createObjectURL(blob)
          }

          this.mediaRecorder.start()
        })
    },
    stopRecording() {
      clearInterval(this.timer)

      // Возврат промиса для ожидания завершения записи
      return new Promise((resolve, reject) => {
        // Обработка события onstop
        this.mediaRecorder.onstop = () => {
          let blob = new Blob(this.recordedChunks, { type: 'audio/mp3' })
          this.audioUrl = URL.createObjectURL(blob)

          // Вызов события task-finished после завершения записи
          this.$emit('task-finished', {
            audioUrl: this.audioUrl,
            taskNumber: this.task.taskNumber
          })

          // Разрешение промиса после завершения записи
          resolve()
        }

        // Остановка записи
        this.mediaRecorder.stop()
      })
    },
    playRecording() {
      let audio = new Audio(this.audioUrl)
      audio.play()
      console.log(this.audioUrl)
    }
  },
  computed: {
    recordData() {
      const item = {}
      item.timeout = this.task.recordTimeout
      item.type = 'record'
      return item
    }
  },
  emits: ['task-finished'],
  mounted() {
    setInterval(() => {
      if (this.beforeTaskTimer > 0) {
        this.beforeTaskTimer--
      }
    }, 1000)
  }
}
</script>

<style>
.countdown-container {
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 3rem;
}
</style>
