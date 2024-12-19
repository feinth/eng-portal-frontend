<template>
  <div>
    <Timer v-if="showTimerPrepare" :duration="5" :audioSrc="task.audio_guidance" :type="'test'"
      @countdown-finished="startTask" />
    <Timer v-if="showTimerAnswer" :duration="5" :audioSrc="task.audio_before_execution" :type="'answer'"
      @countdown-finished="startRecord" />

    <div v-show="currentState === 'prepare' && taskStarted" class="bg-gray-100 p-4 rounded-lg shadow-md">
      <div class="row q-col-gutter-lg">
        <div class="col-6">
          <p class="text-h4 font-bold text-gray-800 mt-4">
            {{ `Task ${task.type}.` }}
          </p>
          <p class="text-h5 text-gray-800 mt-4">
            {{ 'Study the advertisement.' }}
          </p>
          <q-separator spaced class="my-2" />
          <MarkdownView class="text-h5 font-bold text-gray-800 mt-4" :content="task.header" />
          <ul>
            <li v-for="(question, index) in task.questions" :key="index" class="text-h5 font-bold text-gray-800 mt-4">
              {{ `${index + 1}) ` + question.description }}
            </li>
          </ul>
          <br />
          <MarkdownView class="text-h5 font-bold text-gray-800 mt-4"
            :content="'**You have 20 seconds to ask each question.**'" />
        </div>

        <div class="col-6 text-gray-800 my-card image-container">
          <q-item>
            <q-item-section>
              <MarkdownView lass="text-h5" :content="task.images[0].header" />
              <q-img :src="task.images[0].image" class="image-max-size" />
            </q-item-section>
          </q-item>
        </div>
      </div>
    </div>

    <MicrophoneFooterPrepare v-if="currentState === 'prepare' && taskStarted" :timeout="task.preparation_seconds"
      @prepare-completed="prepareStop" />

    <div v-else-if="currentState === 'record' && recordStarted">
      <div class="bg-gray-100 p-4 rounded-lg shadow-md">
        <div class="row q-col-gutter-lg">
          <div class="text-h5 col-6">
            <p class="text-h4 font-bold text-gray-800 mt-4">
              {{ `Task ${task.type}.` }}
            </p>
            <p class="text-h5 text-gray-800 mt-4">
              {{ 'Study the advertisement.' }}
            </p>
            <q-separator spaced class="text-h5 text-gray-800 mt-4 my-2" />
            {{
              `Question ${currentQuestionIndex + 1}: ${currentQuestion.description}`
            }}
          </div>

          <div class="col-6 text-gray-800 my-card image-container">
            <q-item>
              <q-item-section>
                <MarkdownView :content="task.images[0].header" />
                <q-img :src="task.images[0].image" class="image-max-size" />
              </q-item-section>
            </q-item>
          </div>
        </div>
        <MicrophoneFooterRecord :key="currentQuestionIndex" :timeout="20" :taskId="task.id"
          :assignmentId="currentQuestion.id" :audioBeforeSource="currentQuestion.audio_guidance"
          @record-completed="recordStop" />
      </div>
    </div>
  </div>
</template>

<script>
import Timer from '../utils/timer.vue'
import MarkdownView from '../utils/markdown-view.vue'
import MicrophoneFooterPrepare from '../microphone/microphone-footer-prepare.vue'
import MicrophoneFooterRecord from '../microphone/microphone-footer-record.vue'

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
      currentState: 'prepare',
      showTimerPrepare: false,
      showTimerAnswer: false,
      showTask: false,
      currentQuestionIndex: 0 // текущий вопрос
    }
  },
  computed: {
    currentQuestion() {
      return this.task.questions[this.currentQuestionIndex]
    }
  },
  methods: {
    startTask() {
      this.showTimerPrepare = false
      this.taskStarted = true
      this.showTask = true
    },
    startRecord() {
      this.showTimerAnswer = false
      this.showTask = true
      this.recordStarted = true
    },
    prepareStop() {
      this.showTask = false
      this.showTimerAnswer = true
      this.currentState = 'record'
    },
    recordStop() {
      if (this.currentQuestionIndex < this.task.questions.length - 1) {
        this.currentQuestionIndex++
      } else {
        this.$emit('next-task')
      }
    }
  },
  emits: ['next-task'],

  mounted() {
    this.showTimerPrepare = true
  }
}
</script>
<style>
.image-max-size {
  max-width: 500px;
  max-height: 500px;
  object-fit: contain;
}

.markdown-content {
  color: #01695c;
  /* Переопределение цвета текста */
  font-weight: bold;
}

.image-container {
  justify-content: center;
  /* Горизонтальное выравнивание по центру */
  align-items: center;
  /* Вертикальное выравнивание по центру */
  gap: 20px;
  /* Отступ между изображениями */
}
</style>
