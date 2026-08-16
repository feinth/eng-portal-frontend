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
  const isUnlocked = ref(false) // ← НОВОЕ: флаг разблокировки

  // Инициализация AudioContext
  const initAudioContext = () => {
    if (!audioContext.value && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      audioContext.value = new AudioContext()
      isAudioContextAllowed.value = true
    }
  }

  // ← НОВЫЙ МЕТОД: разблокирует аудио на iOS
  // ДОЛЖЕН вызываться СИНХРОННО в обработчике клика пользователя!
  const unlockAudio = () => {
    if (isUnlocked.value) return
    
    // 1. Создаём AudioContext если его нет
    initAudioContext()
    
    if (!audioContext.value) return
    
    // 2. Resume контекста (важно для iOS)
    if (audioContext.value.state === 'suspended') {
      audioContext.value.resume()
    }
    
    // 3. Создаём пустой буфер на 0.1 секунды тишины
    // Это "обманывает" iOS и разблокирует аудио вывод
    try {
      const buffer = audioContext.value.createBuffer(1, 1, 22050)
      const source = audioContext.value.createBufferSource()
      source.buffer = buffer
      source.connect(audioContext.value.destination)
      source.start(0)
      
      isUnlocked.value = true
    } catch (err) {
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

  const fetchAndPlayAudio = async (audioSrc) => {
    if (!isUnlocked.value) {
      unlockAudio()
    }
    
    if (!audioContext.value) {
      // Фолбэк: пробуем через обычный HTMLAudioElement
      return playAudioFallback(audioSrc)
    }

    try {
      const response = await fetch(audioSrc)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.value.decodeAudioData(arrayBuffer)
      await playAudioWithContext(audioBuffer)
    } catch (err) {
      return playAudioFallback(audioSrc)
    }
  }

  // ← НОВЫЙ МЕТОД: фолбэк через HTMLAudioElement
  const playAudioFallback = (audioSrc) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioSrc)
      audio.onended = () => resolve()
      audio.onerror = (e) => reject(e)
      audio.play().catch(err => {
        Notify.create({
          message: 'Не удалось воспроизвести аудио. Тапните по экрану и попробуйте снова.',
          color: 'warning'
        })
        reject(err)
      })
    })
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
        await fetchAndPlayAudio(examStore.audioGuidance.start_exam_audio);
        isIntroAudioPlayed.value = true;
      }
  
      resolve();
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
    fetchAndPlayAudio,
    unlockAudio,          // ← НОВОЕ: экспортируем
    isUnlocked            // ← НОВОЕ: экспортируем
  }
})