<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Проверка микрофона</h1>
    <div v-if="microphonePermission">
      <p class="mb-4">
        Микрофон обнаружен! Сейчас будет производиться проверка микрофона.
      </p>
      <p class="mb-4">
        Нажмите кнопку записи внизу, произнесите несколько слов, остановите
        запись, затем попробуйте воспроизвести.
      </p>
      <p>Если вы уже делали это, можете сразу перейти к выполнению задания.</p>
      <MicrophoneFooter
        :timeout="0"
        type="recording"
        @stop="stopRecording"
        @start="startRecording"
      />
    </div>
    <div v-else>
      <p>Пожалуйста, предоставьте доступ к микрофону для продолжения.</p>
    </div>
  </div>
</template>

<script>
import MicrophoneFooter from './microphone-footer.vue'

export default {
  components: {
    MicrophoneFooter
  },
  data() {
    return {
      microphonePermission: false,
      mediaRecorder: null,
      audioChunks: [],
      audioBlob: null,
      audioUrl: null
    }
  },
  methods: {
    async checkMicrophonePermission() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        this.microphonePermission = true
      } catch (e) {
        console.error('Permission denied or no microphone found', e)
      }
    },
    startRecording() {
      this.audioChunks = []
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream)
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data)
        }
        this.mediaRecorder.start()
      })
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop()
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/mpeg' })
          this.audioUrl = URL.createObjectURL(this.audioBlob)
        }
      }
    },
    playRecording() {
      if (this.audioUrl) {
        const audio = new Audio(this.audioUrl)
        audio.play()
      }
    }
  },
  mounted() {
    this.checkMicrophonePermission()
  }
}
</script>

<style scoped>
/* Добавьте стили при необходимости */
</style>
