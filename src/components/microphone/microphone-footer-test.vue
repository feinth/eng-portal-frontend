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
        <q-btn v-if="!audioStore.isRecording && !audioStore.audioUrl" :color="footerColor" @click="startRecord" 
          label="Проверить микрофон" no-caps class="w-32" />
        <q-btn v-else-if="audioStore.isRecording" :color="footerColor" @click="stopRecord" 
          label="Завершить проверку" no-caps class="w-32" />
        <q-btn v-else-if="!audioStore.isRecording && audioStore.audioUrl && !isListening" 
          :color="footerColor" @click="startPlayAudio" label="Прослушать" no-caps class="w-32 ml-4" />
        <q-btn v-else-if="!audioStore.isRecording && audioStore.audioUrl && isListening" 
          :color="footerColor" @click="stopPlayAudio" label="Остановить" no-caps class="w-32 ml-4" />
      </div>
    </q-toolbar>
  </div>
</template>

<script>
import { useAudioStore } from '../../stores/audio.store';

export default {
  data() {
    return {
      timeLeft: 0,
      timer: null,
      currentAudioPlay: null,
      isListening: false,
      timeout: 20,
      type: 'prepare',
      audioStore: useAudioStore()
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
    async startRecord() {
      this.timeLeft = 0
      this.type = 'record'
      
      try {
        await this.audioStore.startRecording();
        this.isRecording = true;
        
        this.timer = setInterval(() => {
          this.timeLeft += 1
          if (this.timeLeft >= this.timeout) {
            this.stopRecord()
          }
        }, 1000);
      } catch (error) {
        console.error('Ошибка записи:', error);
      }
    },
    
    async stopRecord() {
      clearInterval(this.timer);
      try {
        await this.audioStore.stopRecording();
        this.type = 'prepare';
      } catch (error) {
        console.error('Ошибка остановки записи:', error);
      }
    },
    
    startPlayAudio() {
      if (this.audioStore.audioUrl) {
        this.currentAudioPlay = new Audio(this.audioStore.audioUrl);
        this.currentAudioPlay.addEventListener('canplaythrough', () => {
          this.currentAudioPlay.play();
        });
        this.isListening = true;
        
        this.currentAudioPlay.addEventListener('ended', () => {
          this.isListening = false;
        });
      }
    },
    
    stopPlayAudio() {
      if (this.currentAudioPlay) {
        this.currentAudioPlay.pause();
        this.isListening = false;
      }
    }
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
    if (this.currentAudioPlay) {
      this.currentAudioPlay.pause();
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