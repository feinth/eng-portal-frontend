<template>
  <div>
    <Timer v-if="showTimerPrepare" :duration="5" :audioSrc="task.audio_guidance" :type="'test'"
      @countdown-finished="startPrepare" />
    <Timer v-if="showTimerAnswer" :duration="5" :audioSrc="audioStore.audioGuidance.before_task_audio" :type="'answer'"
      @countdown-finished="startRecord" />

    <div v-if="prepareStarted || recordStarted">
      <Task4Content :task="task" />
    </div>
    <div v-if="prepareStarted" class="pt-10">
      <MicrophoneFooterPrepare :timeout="task.preparation_seconds" @prepare-completed="prepareStop" />
    </div>
    <div v-else-if="recordStarted" class="pt-10">
      <MicrophoneFooterRecord :timeout="task.execution_seconds" :taskId="task.id" @record-completed="recordStop" />
    </div>

  </div>
</template>

<script>
import Timer from '../utils/timer.vue'
import Task4Content from '../tasks/Task4Content.vue'
import MicrophoneFooterPrepare from '../microphone/microphone-footer-prepare.vue'
import MicrophoneFooterRecord from '../microphone/microphone-footer-record.vue'
import { useAudioStore } from '../../stores/audio.store'
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
      audioStore: useAudioStore(),
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