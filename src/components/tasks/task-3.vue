<template>
  <div>
    <Timer v-if="showTimerPrepare" :duration="5" :audioSrc="task.audio_guidance" :type="'test'"
      @countdown-finished="startPrepare" />

    <!-- Режим подготовки -->
    <div class="task-container mode-block" v-if="prepareStarted">
      <div class="task-intro">
        <span class="task-title">{{ `Task ${task.number}.` }}</span>
        <task-timing :exam-type="examType" :task-type="task.type" class="task-timing-right" />
      </div>
      <span class="task-header">{{ task.header }}</span>
      <fipi-source v-if="examType === 'oge'" />
      <MicrophoneFooterPrepare :timeout="20" @prepare-completed="prepareStop" />
    </div>

    <!-- Режим интервью (воспроизведение аудио) -->
    <div class="task-container" v-if="interviewStarted">
      <div class="task-intro">
        <span class="task-title">{{ `Task ${task.number}.` }}</span>
        <task-timing :exam-type="examType" :task-type="task.type" class="task-timing-right" />
      </div>
      <span class="task-header">Interviewer</span>
    </div>

    <Timer v-if="showTimerAnswer" :duration="5" :type="'answer'" @countdown-finished="startRecord" />

    <!-- Режим ответа на вопрос -->
    <div v-else-if="questionStarted">
      <div class="task-container mode-block">
        <div class="task-intro">
          <span class="task-title">{{ `Task ${task.number}.` }}</span>
          <task-timing :exam-type="examType" :task-type="task.type" class="task-timing-right" />
        </div>
        <span class="task-header">Interviewer: question {{ currentQuestionIndex + 1 }}</span>
        <MicrophoneFooterRecord :key="currentQuestionIndex" :timeout="task.execution_seconds" :taskId="task.id"
          :assignmentId="currentQuestion.id" :audioBeforeSource="currentQuestion.audio"
          :betweenQuestionAudio="audioStore?.audioGuidance?.between_question_audio"
          @record-completed="handleRecordCompleted" />
        <fipi-source v-if="examType === 'oge'" />
      </div>
    </div>
  </div>
</template>

<script>
import Timer from '../utils/timer.vue'
import MarkdownView from '../utils/markdown-view.vue'
import MicrophoneFooterPrepare from '../microphone/microphone-footer-prepare.vue'
import MicrophoneFooterRecord from '../microphone/microphone-footer-record.vue'
import FipiSource from '../fipi-source.vue'
import TaskTiming from '../tasks/task-timing.vue'
import { useAudioStore } from '../../stores/audio.store'

export default {
  components: {
    Timer,
    MarkdownView,
    MicrophoneFooterPrepare,
    MicrophoneFooterRecord,
    FipiSource,
    TaskTiming
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
      currentQuestionIndex: 0,
      showTimerPrepare: false,
      interviewStarted: false,
      prepareStarted: false,
      questionStarted: false,
      showTimerAnswer: false,
      audioStore: useAudioStore()
    }
  },
  methods: {
    finishInterview() {
      this.$emit('next-task')
    },
    startTask() {
      this.prepareStarted = true
    },
    startPrepare() {
      this.showTimerPrepare = false
      this.startTask()
    },
    prepareStop() {
      this.prepareStarted = false
      this.startInterview()
    },
    async startInterview() {
      this.interviewStarted = true

      if (!this.task.audio) {
        this.startTimerAnswer()
        return
      }

      try {
        if (!this.audioStore.audioContext) {
          this.audioStore.initAudioContext()
        }

        await this.audioStore.fetchAndPlayAudio(this.task.audio)
      } catch (error) {
      } finally {
        this.startTimerAnswer()
      }
    },
    startTimerAnswer() {
      this.interviewStarted = false
      this.showTimerAnswer = true
    },
    startRecord() {
      this.questionStarted = true
      this.showTimerAnswer = false
    },
    async handleRecordCompleted() {
      if (this.currentQuestionIndex < this.task.questions.length - 1) {
        this.currentQuestionIndex++
        return
      }

      // Завершение интервью
      try {
        if (
          this.task.audio_after_execution &&
          this.audioStore.audioGuidance?.end_interview_audio
        ) {
          if (!this.audioStore.audioContext) {
            this.audioStore.initAudioContext()
          }

          await this.audioStore.fetchAndPlayAudio(
            this.audioStore.audioGuidance.end_interview_audio
          )
        }
      } catch (error) {
      } finally {
        this.$emit('next-task')
      }
    }
  },
  computed: {
    currentQuestion() {
      return this.task.questions[this.currentQuestionIndex]
    }
  },
  emits: ['next-task'],
  mounted() {
    this.showTimerPrepare = true
  }
}
</script>

<style scoped>
/* Контейнер задания */
.task-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 3rem;
  background-color: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

/* Отступ снизу, чтобы фиксированный футер не перекрывал контент */
.mode-block {
  padding-bottom: 7rem;
}

/* Заголовок и тайминг */
.task-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.task-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--q-primary);
  line-height: 1.3;
}

/* Текст-подзаголовок (Interviewer / Interviewer: question N) */
.task-header {
  display: block;
  font-size: 1rem;
  line-height: 1.9;
  color: #2B2D42;
  margin-bottom: 1rem;
}

/* Плашка с таймингом */
.task-timing-right {
  flex-shrink: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .task-container {
    padding: 1.75rem 1.5rem;
    border-radius: 16px;
  }

  .mode-block {
    padding-bottom: 6rem;
  }

  .task-title {
    font-size: 1.6rem;
  }

  .task-header {
    font-size: 1rem;
  }
}

/* На мобильных: тайминг переносится ПОД заголовок */
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