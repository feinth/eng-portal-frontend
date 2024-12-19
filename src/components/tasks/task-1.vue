<template>
  <div>
    <div v-if="showTimerPrepare">
      <Timer :duration="5" :audioSrc="task.audio_guidance" :type="'test'" @countdown-finished="startTask" />
    </div>
    <div v-if="showTimerAnswer">
      <Timer :duration="5" :audioSrc="this.examStore.audioGuidance.before_task_audio" :type="'answer'"
        @countdown-finished="startRecord" />
    </div>
    <div v-show="showTask" class="bg-gray-100 p-4 rounded-lg shadow-md">
      <p class="text-h4 text-gray-800 mt-4">
        {{ `Task ${task.type}.` }}
      </p>
      <p class="text-h5 text-gray-800 mt-4">
        {{ task.header }}
      </p>
      <q-separator spaced class="my-2" />
      <MarkdownView class="text-h5 text-gray-800 mt-4" :content="task.description" />
    </div>
    <div v-if="currentState === 'prepare' && taskStarted">
      <MicrophoneFooterPrepare :timeout="task.preparation_seconds" @prepare-completed="prepareStop" />
    </div>

    <div v-else-if="currentState === 'record' && recordStarted">
      <MicrophoneFooterRecord :timeout="task.execution_seconds" :taskId="task.id" @record-completed="recordStop" />
    </div>
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
      currentState: 'prepare',
      examStore: useExamStore(),
      showTimerPrepare: false,
      showTimerAnswer: false,
      showTask: false
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
    startReading() {
      this.$emit('next-task')
    },
    prepareStop() {
      this.showTask = false
      this.showTimerAnswer = true
      this.currentState = 'record'
    },
    recordStop() {
      this.startReading()
    }
  },
  emits: ['next-task'],
  mounted() {
    this.showTimerPrepare = true
  }
}
</script>
