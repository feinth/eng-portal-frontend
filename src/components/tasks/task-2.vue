<template>
  <div>
    <Timer v-if="showTimerPrepare" :duration="5" :audioSrc="task.audio_guidance" :type="'test'"
      @countdown-finished="startTask" />
    <Timer v-if="showTimerAnswer" :duration="5" :audioSrc="task.audio_before_execution" :type="'answer'"
      @countdown-finished="startRecord" />
    <Task2Content v-if="currentState === 'prepare' && taskStarted" :task="task" :exam-type="examType" />
    <div v-if="currentState === 'prepare' && taskStarted" class="pt-10">
      <MicrophoneFooterPrepare :timeout="task.preparation_seconds" @prepare-completed="prepareStop" />
    </div>
    <div v-else-if="currentState === 'record' && recordStarted">
      <div class="bg-gray-100 p-4 rounded-lg shadow-md">
        <div class="record-layout">
          <div class="record-text">
            <!-- Заголовок и плашка -->
            <div class="task-intro">
              <span class="task-title">{{ `Task ${task.number}.` }}</span>
              <task-timing :exam-type="examType" :task-type="task.type" class="task-timing-right" />
            </div>
            <!-- Текст задания во всю ширину -->
            <div class="task-header">{{ task.header }}</div>
            <q-separator spaced class="my-2" />
            <div class="question-text">
              {{ `Question ${currentQuestionIndex + 1}: ${currentQuestion.description}` }}
            </div>
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
import TaskTiming from '../tasks/task-timing.vue'
import MicrophoneFooterPrepare from '../microphone/microphone-footer-prepare.vue'
import MicrophoneFooterRecord from '../microphone/microphone-footer-record.vue'

export default {
  components: {
    Timer,
    MarkdownView,
    Task2Content,
    TaskTiming,
    MicrophoneFooterPrepare,
    MicrophoneFooterRecord
  },
  props: {
    task: {
      type: Object,
      required: true
    },
    examType: {
      type: String,
      default: 'ege'
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
      currentQuestionIndex: 0
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
/* Двухколоночный макет для режима записи */
.record-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* Заголовок и плашка */
.task-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

/* Заголовок "Task N." */
.task-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--q-primary);
  line-height: 1.3;
}

/* Плашка с таймингом */
.task-timing-right {
  flex-shrink: 0;
}

/* Текст задания во всю ширину */
.task-header {
  display: block;
  font-size: 1rem;
  line-height: 1.9;
  color: #2B2D42;
  margin-bottom: 0.5rem;
}

/* Текст вопроса */
.question-text {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #3D3D3D;
  font-weight: 500;
}

/* Правая колонка с картинкой — опущена ниже */
.task-image {
  margin-top: 3rem;
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

/* Адаптивность: одна колонка */
@media (max-width: 900px) {
  .record-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .task-image {
    margin-top: 0;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
  }
}

/* На мобильных: плашка ПОД заголовком */
@media (max-width: 600px) {
  .task-intro {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-timing-right {
    width: 100%;
    margin-top: 0.5rem;
  }
}

@media (max-width: 768px) {
  .task-title {
    font-size: 1.6rem;
  }

  .task-header {
    font-size: 1.1rem;
  }

  .question-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .task-title {
    font-size: 1.4rem;
  }

  .task-header {
    font-size: 1rem;
  }
}
</style>