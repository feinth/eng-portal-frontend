import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useExamStore } from './exam.store'
import { Notify } from 'quasar'

export const useAudioStore = defineStore('audio', () => {
  const mediaRecorder = ref(null)
  const audioChunks = ref([])
  const audioBlob = ref(null)
  const audioUrl = ref(null)
  const isRecording = ref(false)
  const error = ref(null)
  const isIntroAudioPlayed = ref(false)
  const audioContext = ref(null)
  const isAudioContextAllowed = ref(false)

  // Инициализация AudioContext при первом взаимодействии
  const initAudioContext = () => {
    if (!audioContext.value && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      audioContext.value = new AudioContext()
      isAudioContextAllowed.value = true
    }
  }

  // Функция для воспроизведения аудио через AudioContext
  const playAudioWithContext = async (audioBuffer) => {
    if (!audioContext.value) {
      return
    }

    try {
      if (audioContext.value.state === 'suspended') {
        await audioContext.value.resume()
      }

      const source = audioContext.value.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.value.destination)
      source.start(0)

      return new Promise((resolve) => {
        source.onended = () => resolve()
      })
    } catch (err) {
      Notify.create({
        message: 'Ошибка при воспроизведении аудио: ' + err.message,
        color: 'negative'
      })
    }
  }

  const fetchAndPlayAudio = async (audioUrl) => {
    if (!audioContext.value) {
      return
    }

    try {
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.value.decodeAudioData(arrayBuffer)
      await playAudioWithContext(audioBuffer)
    } catch (err) {
      Notify.create({
        message: 'Ошибка при загрузке аудио: ' + err.message,
        color: 'negative'
      })
    }
  }

  const initRecorder = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        Notify.create({
          message: 'Запись аудио не поддерживается Вашим браузером',
          color: 'negative'
        })
        throw new Error('Запись аудио не поддерживается Вашим браузером')
      }
      const stream = await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .catch((err) => {
          throw new Error('Нет разрешения на использование микрофона')
        })
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      return true
    } catch (err) {
      Notify.create({
        message: 'Ошибка при доступе к микрофону: ' + err.message,
        color: 'negative'
      })
      error.value = 'Ошибка при доступе к микрофону: ' + err.message
      return false
    }
  }
  const playIntroAudio = async () => {
    return new Promise(async (resolve) => {
      const examStore = useExamStore();
  
      if (
        !isIntroAudioPlayed.value &&
        examStore.audioGuidance?.start_exam_audio
      ) {
        initAudioContext();
  
        // 🔥 Ждём окончания проигрывания
        await fetchAndPlayAudio(examStore.audioGuidance.start_exam_audio);
  
        isIntroAudioPlayed.value = true;
      }
  
      resolve(); // ✅ После окончания аудио
    });
  };
  const getSupportedAudioOptions = () => {
    const audioTypes = [
      'audio/mpeg',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg'
    ]

    for (const type of audioTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        return {
          mimeType: type
        }
      }
    }
    Notify.create({
      message: 'No supported audio format found',
      color: 'negative'
    })
    return null
  }
  const startRecording = async () => {
    try {
      error.value = null
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const options = getSupportedAudioOptions()

      if (!options) {
        Notify.create({
          message: 'Ваш браузер не поддерживает запись аудио',
          color: 'negative'
        })
      }

      audioChunks.value = []

      mediaRecorder.value = new MediaRecorder(stream, options)

      mediaRecorder.value.ondataavailable = (e) => {
        audioChunks.value.push(e.data)
      }

      mediaRecorder.value.start()
      isRecording.value = true
    } catch (err) {
      Notify.create({
        message: err.message,
        color: 'negative'
      })
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
    playIntroAudio,
    initAudioContext,
    playAudioWithContext,
    fetchAndPlayAudio
  }
})
