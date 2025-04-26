import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useExamStore } from './exam.store'
export const useAudioStore = defineStore('audio', () => {
  const mediaRecorder = ref(null)
  const audioChunks = ref([])
  const audioBlob = ref(null)
  const audioUrl = ref(null)
  const isRecording = ref(false)
  const error = ref(null)
  const isIntroAudioPlayed = ref(false)

  const initRecorder = async () => {
    try {
      // Только проверяем поддержку API, без запроса прав
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Audio recording is not supported in this browser.");
      }
  
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        .catch(err => {
          console.log("Microphone access check failed (expected on iOS).", err);
          return null;
        });
  
      if (stream) {
        // Если вдруг доступ есть (не iOS или права уже выданы) — закрываем поток
        stream.getTracks().forEach(track => track.stop());
      }
  
      return true;
    } catch (err) {
      error.value = "Microphone check failed: " + err.message;
      throw err;
    }
  };
  const playIntroAudio = async () => {
    return new Promise((resolve) => {
      const examStore = useExamStore();
      if (!isIntroAudioPlayed.value && examStore.audioGuidance?.start_exam_audio) {
        const audio = new Audio(examStore.audioGuidance.start_exam_audio);
        
        // Обработка ошибок воспроизведения (особенно важно для iOS)
        audio.play().catch(err => {
          error.value = "Playback failed: " + err.message;
          console.error("Audio playback error:", err);
        });
        
        audio.onended = () => {
          isIntroAudioPlayed.value = true;
          resolve();
        };
      } else {
        resolve();
      }
    });
  }

  const startRecording = async () => {
    try {
      error.value = null
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunks.value = []

      mediaRecorder.value = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/mpeg')
          ? 'audio/mpeg'
          : 'audio/webm'
      })

      mediaRecorder.value.ondataavailable = (e) => {
        audioChunks.value.push(e.data)
      }

      mediaRecorder.value.start()
      isRecording.value = true
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const stopRecording = async () => {
    return new Promise((resolve) => {
      if (!mediaRecorder.value) {
        resolve(null)
        return
      }

      mediaRecorder.value.onstop = () => {
        audioBlob.value = new Blob(audioChunks.value, {
          type: mediaRecorder.value.mimeType
        })
        audioUrl.value = URL.createObjectURL(audioBlob.value)
        mediaRecorder.value.stream.getTracks().forEach((track) => track.stop())
        isRecording.value = false
        resolve(audioBlob.value)
      }

      mediaRecorder.value.stop()
    })
  }

  return {
    mediaRecorder,
    audioBlob,
    audioUrl,
    isRecording,
    error,
    initRecorder,
    startRecording,
    stopRecording,
    playIntroAudio
  }
})
