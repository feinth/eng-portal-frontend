<template>
  <div>
    <Timer
      v-if="showTimerPrepare"
      :duration="5"
      :audioSrc="task.audio_guidance"
      :type="'test'"
      @countdown-finished="startPrepare"
    />
    <div class="bg-gray-100 p-4 rounded-lg shadow-md" v-if="prepareStarted">
      <p class="text-h4 font-bold text-gray-800 mt-4">
        {{ `Task ${task.number}.` }}
      </p>
      <p class="text-h5 font-bold text-gray-800 mt-4">
        {{ task.header }}
      </p>
      <MicrophoneFooterPrepare :timeout="20" @prepare-completed="prepareStop" />
    </div>
    <div class="bg-gray-100 p-4 rounded-lg shadow-md" v-if="interviewStarted">
      <p class="text-h4 font-bold text-gray-800 mt-4">
        {{ `Task ${task.number}.` }}
      </p>
      <p class="text-h4 font-bold text-gray-800 mt-4">
        {{ `Interviewer` }}
      </p>
    </div>

    <Timer
      v-if="showTimerAnswer"
      :duration="5"
      :type="'answer'"
      @countdown-finished="startRecord"
    />
    <div v-else-if="questionStarted">
      <div class="bg-gray-100 p-4 rounded-lg shadow-md">
        <p class="text-h4 font-bold text-gray-800 mt-4">
          {{ `Task ${task.number}.` }}
        </p>
        <p class="text-h4 font-bold text-gray-800 mt-4">
          {{ `Interviewer: question ${currentQuestionIndex + 1}` }}
        </p>
        <MicrophoneFooterRecord
          :key="currentQuestionIndex"
          :timeout="task.execution_seconds"
          :taskId="task.id"
          :assignmentId="currentQuestion.id"
          :audioBeforeSource="currentQuestion.audio"
          :betweenQuestionAudio="
            examStore?.audioGuidance?.between_question_audio
          "
          @record-completed="handleRecordCompleted"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Timer from '../utils/timer.vue'
import MarkdownView from '../utils/markdown-view.vue'
import MicrophoneFooterPrepare from '../microphone/microphone-footer-prepare.vue'
import MicrophoneFooterRecord from '../microphone/microphone-footer-record.vue'
import { useExamStore } from '../../stores/exam.store'
import { useAudioStore } from '../../stores/audio.store'
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
      currentQuestionIndex: 0,
      showTimerPrepare: false,
      interviewStarted: false,
      prepareStarted: false,
      questionStarted: false,
      showTimerAnswer: false,
      examStore: useExamStore(),
      audioStore: useAudioStore()
    }
  },
  methods: {
    finishInterview() {
      // Логика завершения интервью
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
          examStore.audioGuidance?.end_interview_audio
        ) {
          // Инициализируем AudioContext если ещё не был инициализирован
          if (!this.audioStore.audioContext) {
            this.audioStore.initAudioContext()
          }

          // Воспроизводим завершающее аудио
          await this.audioStore.fetchAndPlayAudio(
            this.examStore.audioGuidance.end_interview_audio
          )
        }
      } catch (error) {
      } finally {
        // В любом случае переходим к следующему заданию
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
