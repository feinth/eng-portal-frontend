<template>
  <div class="container mx-auto p-4">
    
    <div v-if="!checkedMicrophone">
      <h1 class="text-2xl text-center font-bold mb-4">Проверка микрофона</h1>
      <q-btn-group spread>
        
        <q-btn label="Разрешить доступ к микрофону" color="primary" @click="checkMicrophonePermission" />
      </q-btn-group>
    </div>
    <div v-else-if="microphonePermission">
      <p class="mb-4">
        Микрофон обнаружен! Сейчас будет производиться проверка микрофона.
      </p>
      <p class="mb-4">
        Нажмите кнопку записи внизу, произнесите несколько слов, остановите
        запись, затем попробуйте воспроизвести.
      </p>
      <p>Если вы уже делали это, можете сразу перейти к выполнению задания.</p>
      <q-btn-group spread>
        <q-btn label="Перейти к выполнению задания" color="red" @click="goToExam" />
      </q-btn-group>
      <MicrophoneFooterTest :timeout="10" type="prepare" @stop="stopRecording" @start="startRecording" />
    </div>
    <div v-else>
      <p>Доступ к микрофону отклонен. Пожалуйста, предоставьте доступ для продолжения.</p>
      <q-btn label="Попробовать снова" color="secondary" @click="checkMicrophonePermission" />
    </div>
  </div>
  <!-- <div class="container mx-auto p-4">
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
      <q-btn-group spread>
        <q-btn label="Перейти к выполнению задания" color="red" @click="goToExam" />
      </q-btn-group>
      <MicrophoneFooterTest :timeout="10" type="prepare" @stop="stopRecording" @start="startRecording" />
    </div>
    <div v-else>
      <p>Пожалуйста, предоставьте доступ к микрофону для продолжения.</p>
    </div>
  </div> -->
</template>

<script>
import MicrophoneFooterTest from '../components/microphone/microphone-footer-test.vue'
import { router } from '../router/router.js'
export default {
  components: {
    MicrophoneFooterTest
  },
  data() {
    return {
      microphonePermission: false,
      checkedMicrophone: false,
      mediaRecorder: null,
      audioChunks: [],
      audioBlob: null,
      audioUrl: null,
      router: router
    }
  },
  methods: {
    async checkMicrophonePermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        this.microphonePermission = true
        stream.getTracks().forEach(track => track.stop()) // Останавливаем поток после проверки
      } catch (e) {
        this.$q.notify({
          message: 'Доступ к микрофону отклонен',
          color: 'negative'
        })
      } finally {
        this.checkedMicrophone = true
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
    },
    goToExam() {
      this.router.push('/exam')
    }
  },
}
</script>

<style scoped></style>
