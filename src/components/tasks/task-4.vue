<template>
  <div>
    <Timer v-if="showTimerPrepare" :duration="5" :audioSrc="task.audio_guidance" :type="'test'"
      @countdown-finished="startPrepare" />
    <Timer v-if="showTimerAnswer" :duration="5" :audioSrc="examStore.audioGuidance.before_task_audio" :type="'answer'"
      @countdown-finished="startRecord" />

    <div v-if="prepareStarted || recordStarted" class="bg-gray-100 p-4 rounded-lg shadow-md">
      <Task4Content :task="task" />
    </div>
    <MicrophoneFooterPrepare v-if="prepareStarted" :timeout="task.preparation_seconds"
      @prepare-completed="prepareStop" />
    <MicrophoneFooterRecord v-else-if="recordStarted" :timeout="task.execution_seconds" :taskId="task.id"
      @record-completed="recordStop" />
  </div>
</template>

<script>
import Timer from '../utils/timer.vue'
import Task4Content from '../tasks/Task4Content.vue'
import MicrophoneFooterPrepare from '../microphone/microphone-footer-prepare.vue'
import MicrophoneFooterRecord from '../microphone/microphone-footer-record.vue'
import { useExamStore } from '../../stores/exam.store'
export default {
  components: {
    Timer,
    MicrophoneFooterPrepare,
    MicrophoneFooterRecord,
    Task4Content
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