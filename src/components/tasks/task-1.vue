<template>
  <div>
    <div v-if="showTimerPrepare">
      <Timer :duration="5" :audioSrc="task.audio_guidance" :type="'test'" @countdown-finished="startTask" />
    </div>

    <div v-if="showTimerAnswer">
      <Timer :duration="5" :audioSrc="this.audioStore.audioGuidance.before_task_audio" :type="'answer'"
        @countdown-finished="startRecord" />
    </div>

    <div v-show="showTask">
      <Task1Content :task="task" />
    </div>

    <div v-if="currentState === 'prepare' && taskStarted" class="pt-10">
      <MicrophoneFooterPrepare :timeout="task.preparation_seconds" @prepare-completed="prepareStop" />
    </div>

    <div v-else-if="currentState === 'record' && recordStarted" class="pt-10">
      <MicrophoneFooterRecord :timeout="task.execution_seconds" :taskId="task.id" @record-completed="recordStop" />
    </div>
  </div>
</template>

<script>
import Timer from '../utils/timer.vue'
import Task1Content from './Task1Content.vue'
import MicrophoneFooterPrepare from '../microphone/microphone-footer-prepare.vue'
import MicrophoneFooterRecord from '../microphone/microphone-footer-record.vue'
import { useAudioStore } from '../../stores/audio.store'

export default {
  components: {
    Timer,
    Task1Content,
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
      audioStore: useAudioStore(),
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
