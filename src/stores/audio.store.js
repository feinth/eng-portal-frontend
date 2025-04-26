import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAudioStore = defineStore('audio', () => {
  const mediaRecorder = ref(null);
  const audioChunks = ref([]);
  const audioBlob = ref(null);
  const audioUrl = ref(null);
  const isRecording = ref(false);
  const error = ref(null);

  const initRecorder = async () => {
    try {
      // Проверяем доступ к микрофону
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const startRecording = async () => {
    try {
      error.value = null;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks.value = [];
      
      mediaRecorder.value = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm; codecs=opus') 
          ? 'audio/webm; codecs=opus' 
          : 'audio/mpeg',
      });

      mediaRecorder.value.ondataavailable = (e) => {
        audioChunks.value.push(e.data);
      };

      mediaRecorder.value.start();
      isRecording.value = true;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const stopRecording = async () => {
    return new Promise((resolve) => {
      if (!mediaRecorder.value) {
        resolve(null);
        return;
      }

      mediaRecorder.value.onstop = () => {
        audioBlob.value = new Blob(audioChunks.value, { 
          type: mediaRecorder.value.mimeType 
        });
        audioUrl.value = URL.createObjectURL(audioBlob.value);
        mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
        isRecording.value = false;
        resolve(audioBlob.value);
      };
      
      mediaRecorder.value.stop();
    });
  };

  return { 
    mediaRecorder,
    audioBlob,
    audioUrl,
    isRecording,
    error,
    initRecorder,
    startRecording,
    stopRecording
  };
});