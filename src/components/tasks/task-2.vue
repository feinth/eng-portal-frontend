<template>
  <div>
    <Timer v-if="showTimerPrepare" :duration="5" :audioSrc="task.audio_guidance" :type="'test'"
      @countdown-finished="startTask" />
    <Timer v-if="showTimerAnswer" :duration="5" :audioSrc="task.audio_before_execution" :type="'answer'"
      @countdown-finished="startRecord" />

    <Task2Content v-if="currentState === 'prepare' && taskStarted" :task="task" />
    <div v-if="currentState === 'prepare' && taskStarted" class="pt-10">
      <MicrophoneFooterPrepare :timeout="task.preparation_seconds" @prepare-completed="prepareStop" />
    </div>

    <div v-else-if="currentState === 'record' && recordStarted">
      <div class="bg-gray-100 p-4 rounded-lg shadow-md">
        <div class="row q-col-gutter-lg">
          <div class="text-h5 col-6">
            <!-- Заголовок и текст задания в одну строку -->
            <div class="task-intro">
              <span class="task-title">{{ `Task ${task.number}.` }}</span>
              <span class="task-header">{{ task.header }}</span>
            </div>
            <q-separator spaced class="my-2" />
            {{
              `Question ${currentQuestionIndex + 1}: ${currentQuestion.description}`
            }}
          </div>

          <div class="task-image">
            <q-item>
              <q-item-section>
                <div class="image-header-card">
                  <MarkdownView :content="task?.images?.[0].header" />
                </div>
                <q-img :src="task.images[0].image" class="image-max-size" />
              </q-item-section>
            </q-item>
          </div>
        </div>
        <div class="pt-10">
          <MicrophoneFooterRecord :key="currentQuestionIndex" :timeout="20" :taskId="task.id"
            :assignmentId="currentQuestion.id" :audioBeforeSource="currentQuestion.audio_guidance"
            @record-completed="recordStop" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Timer from '../utils/timer.vue'
import MarkdownView from '../utils/markdown-view.vue'
import Task2Content from '../tasks/Task2Content.vue'
import MicrophoneFooterPrepare from '../microphone/microphone-footer-prepare.vue'
import MicrophoneFooterRecord from '../microphone/microphone-footer-record.vue'

export default {
  components: {
    Timer,
    MarkdownView,
    Task2Content,
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
<style scoped>
/* Заголовок + текст в одну строку */
.task-intro {
  margin-bottom: 1.5rem;
  line-height: 1.9;
}

/* Заголовок "Task N." */
.task-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--q-primary);
  margin-right: 0.5rem;
}

/* Текст задания продолжается в строку после заголовка */
.task-header {
  font-size: 1.3rem;
  line-height: 1.9;
  color: #2B2D42;
}

/* Рамка-заголовок над изображением */
.image-header-card {
  border: 2px solid var(--q-primary);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  text-align: center;
  color: var(--q-primary);
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 1rem;
  background-color: #FFFFFF;
}

/* Адаптивность: одна колонка на планшете и мобильном */
@media (max-width: 900px) {
  .task-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .task-image {
    max-width: 500px;
    margin: 0 auto;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .task-container {
    padding: 1.75rem 1.5rem;
    border-radius: 16px;
  }

  .task-title {
    font-size: 1.6rem;
    margin-bottom: 1.25rem;
  }

  .task-subtitle {
    display: block;
    margin-left: 0;
    margin-top: 0.5rem;
  }

  .task-description,
  .question-item,
  .task-note {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .task-container {
    padding: 1.25rem 1rem;
    border-radius: 12px;
  }

  .task-title {
    font-size: 1.4rem;
  }
}
</style>