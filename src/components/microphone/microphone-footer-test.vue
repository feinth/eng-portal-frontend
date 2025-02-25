<template>
  <div class="fixed bottom-0 left-0 w-full border border-gray-300">
    <q-toolbar>
      <!-- иконка -->
      <div class="flex items-center">
        <div class="mr-4 flex items-center">
          <q-btn :color="footerColor" icon="sym_o_mic" :label="footerLabel" no-caps class="w-32" />
        </div>
      </div>

      <div class="flex-grow flex items-center justify-center">
        <q-linear-progress stripe class="q-my-md" size="25px" :value="timeLeft / timeout" :max="100"
          :color="footerColor">
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="black" :label="countdown" />
          </div>
        </q-linear-progress>
      </div>
      <!-- прогресс -->
      <div class="flex items-center ml-4">
        <q-btn v-if="!isRecording && !audioUrl" :color="footerColor" @click="startRecord" label="Проверить микрофон"
          no-caps class="w-32" />
        <q-btn v-else-if="isRecording" :color="footerColor" @click="stopRecord" label="Завершить проверку" no-caps
          class="w-32" />
        <q-btn v-else-if="!isRecording && audioUrl && !isListening" :color="footerColor" @click="startPlayAudio"
          label="Прослушать" no-caps class="w-32 ml-4" />
        <q-btn v-else-if="!isRecording && audioUrl && isListening" :color="footerColor" @click="stopPlayAudio"
          label="Остановить" no-caps class="w-32 ml-4" />
      </div>
    </q-toolbar>
  </div>
</template>

<script>

export default {
  data() {
    return {
      timeLeft: 0,
      timer: null,
      mediaRecorder: null,
      audioChunks: [],
      audioUrl: null,
      currentAudioPlay: null,
      isRecording: false,
      timeout: 20,
      isListening: false,
      type: 'prepare'
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
    startRecord() {
      this.timeLeft = 0
      this.audioChunks = []
      this.audioUrl = null
      this.isRecording = true
      this.type = 'record'
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
          const audioBlob = new Blob(this.audioChunks)
          this.audioUrl = URL.createObjectURL(audioBlob)
          this.isRecording = false
          this.type = 'prepare'
        }
      }
    },
    startPlayAudio() {
      if (this.audioUrl) {
        this.currentAudioPlay = new Audio(this.audioUrl)
        this.currentAudioPlay.addEventListener('canplaythrough', () => {
          this.currentAudioPlay.play();
        });
        this.isListening = true
      }
    },
    stopPlayAudio() {
      if (this.currentAudioPlay) {
        this.currentAudioPlay.pause()
        this.isListening = false
      }
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
