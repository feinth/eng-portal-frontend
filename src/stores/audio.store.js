import { defineStore } from 'pinia'
import { ref } from 'vue'
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
  const isUnlocked = ref(false)
  const audioGuidance = ref(null)
  const introAudioBuffer = ref(null)

  const initAudioContext = () => {
    if (!audioContext.value && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      audioContext.value = new AudioContext()
      isAudioContextAllowed.value = true
    }
  }

  const unlockAudio = () => {
    if (isUnlocked.value) return
    
    initAudioContext()
    
    if (!audioContext.value) return
    
    if (audioContext.value.state === 'suspended') {
      audioContext.value.resume()
    }
    
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

  const playAudioFallback = (audioSrc) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioSrc)
      audio.onended = () => resolve()
      audio.onerror = (e) => reject(e)
      audio.play().catch(err => {
        Notify.create({
          message: 'Не удалось воспроизвести аудио',
          color: 'warning'
        })
        reject(err)
      })
    })
  }

  const preloadAudioGuidance = async () => {
    try {
      const api = (await import('../api/api')).default
      
      const res = await api({
        method: 'GET',
        url: '/audio-guidance'
      })

      audioGuidance.value = res.data
      
      // Предзагружаем intro аудио в ArrayBuffer (в память браузера)
      if (audioGuidance.value?.start_exam_audio) {
        initAudioContext()
        
        const response = await fetch(audioGuidance.value.start_exam_audio)
        const arrayBuffer = await response.arrayBuffer()
        introAudioBuffer.value = await audioContext.value.decodeAudioData(arrayBuffer)
      }
      
      return audioGuidance.value
    } catch (err) {
      Notify.create({
        message: 'Не удалось загрузить аудио сопровождение',
        color: 'negative'
      })
      throw err
    }
  }

  const playIntroAudio = async () => {
    if (isIntroAudioPlayed.value) return
    
    if (!introAudioBuffer.value) {
      // Если буфер не предзагружен, пытаемся загрузить сейчас
      if (audioGuidance.value?.start_exam_audio) {
        return fetchAndPlayAudio(audioGuidance.value.start_exam_audio)
      }
      return
    }

    // Воспроизводим из памяти (мгновенно!)
    try {
      await playAudioWithContext(introAudioBuffer.value)
      isIntroAudioPlayed.value = true
    } catch (err) {
      // Фолбэк на случай ошибки
      if (audioGuidance.value?.start_exam_audio) {
        await playAudioFallback(audioGuidance.value.start_exam_audio)
        isIntroAudioPlayed.value = true
      }
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

  const resetAudioStore = () => {
    if (isRecording.value && mediaRecorder.value) {
      try {
        mediaRecorder.value.stream.getTracks().forEach((track) => track.stop())
        mediaRecorder.value.stop()
      } catch (err) {
        // Игнорируем ошибки при остановке
      }
    }


    // Освобождаем URL аудио-блоба
    if (audioUrl.value) {
      URL.revokeObjectURL(audioUrl.value)
    }

    // Закрываем AudioContext
    if (audioContext.value) {
      audioContext.value.close().catch(() => {})
      audioContext.value = null
    }

    // Сбрасываем все состояния
    mediaRecorder.value = null
    audioChunks.value = []
    audioBlob.value = null
    audioUrl.value = null
    isRecording.value = false
    error.value = null
    isIntroAudioPlayed.value = false
    isUnlocked.value = false
    isAudioContextAllowed.value = false
  }

  return {
    mediaRecorder,
    audioBlob,
    audioUrl,
    isRecording,
    error,
    audioGuidance,
    introAudioBuffer,
    initRecorder,
    startRecording,
    stopRecording,
    initAudioContext,
    playAudioWithContext,
    fetchAndPlayAudio,
    unlockAudio,
    isUnlocked,
    preloadAudioGuidance,
    playIntroAudio,
    resetAudioStore
  }
})