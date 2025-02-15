<template>
  <div>
    <Timer v-if="showTimerPrepare" :duration="5" :audioSrc="task.audio_guidance" :type="'test'"
      @countdown-finished="startPrepare" />
    <Timer v-if="showTimerAnswer" :duration="5" :audioSrc="examStore.audioGuidance.before_task_audio"
      :type="'answer'" @countdown-finished="startRecord" />

    <div v-if="prepareStarted || recordStarted" class="bg-gray-100 p-4 rounded-lg shadow-md">
      <div>
        <p class="text-h4 font-bold text-gray-800 mt-4">
          {{ `Task ${task.type}.` }}
        </p>
        <MarkdownView class="text-h5 font-bold text-gray-800 mt-4" :content="task.header" />
        <q-separator spaced class="my-2" />
        <MarkdownView class="text-h5 font-bold text-gray-800 mt-4" :content="task.description" />
        <br />

        <!-- Flexbox контейнер для выравнивания изображений -->
        <div class="image-container text-gray-800 mt-4">
          <q-img :src="task.images[0].image" class="image-max-size" />
          <q-img :src="task.images[1].image" class="image-max-size" />
        </div>
      </div>
    </div>
    <MicrophoneFooterPrepare v-if="prepareStarted" :timeout="task.preparation_seconds"
      @prepare-completed="prepareStop" />
    <MicrophoneFooterRecord v-else-if="recordStarted" :timeout="task.execution_seconds" :taskId="task.id"
      @record-completed="recordStop" />
  </div>
</template>

<script>
import Timer from '../utils/timer.vue'
import MarkdownView from '../utils/markdown-view.vue'
import MicrophoneFooterPrepare from '../microphone/microphone-footer-prepare.vue'
import MicrophoneFooterRecord from '../microphone/microphone-footer-record.vue'
import { useExamStore } from '../../stores/exam.store'
export default {
  components: {
    Timer,
    MarkdownView,
    MicrophoneFooterPrepare,
    MicrophoneFooterRecord
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      taskStarted: false,
      recordStarted: false,
      showTimerPrepare: false,
      showTimerAnswer: false,
      examStore: useExamStore(),
      prepareStarted: false
    }
  },
  methods: {
    startPrepare() {
      this.showTimerPrepare = false
      this.startTask()
    },
    startTask() {
      this.prepareStarted = true
    },

    prepareStop() {
      this.prepareStarted = false
      this.startTimerAnswer()
    },
    startTimerAnswer() {
      this.showTimerAnswer = true
    },
    startRecord() {
      this.showTimerAnswer = false
      this.recordStarted = true
    },
    recordStop() {
      this.$emit('next-task')
    }
  },
  emits: ['next-task'],
  mounted() {
    this.showTimerPrepare = true
  }
}
</script>

<style scoped>
/* Flexbox контейнер для выравнивания изображений */
.image-container {
  display: flex;
  justify-content: center;
  /* Горизонтальное выравнивание по центру */
  align-items: center;
  /* Вертикальное выравнивание по центру */
  gap: 120px;
  /* Отступ между изображениями */
}

/* Ограничиваем максимальные размеры изображений */
.image-max-size {
  max-width: 900px;
  max-height: 900px;
  object-fit: contain;
}

/* Стили для текста поверх изображения */
.image-text {
  position: absolute;
  top: 50%;
  /* Расположить по середине изображения */
  left: 50%;
  /* Центрировать по горизонтали */
  transform: translate(-50%,
      -50%);
  /* Сдвинуть текст для точного центрирования */
  color: white;
  /* Цвет текста (или другой, если нужно) */
  font-weight: bold;
  /* Жирный шрифт для текста */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  /* Тень для улучшения читабельности */
  text-align: center;
}
</style>
