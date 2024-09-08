<template>
  <Timer
    v-if="!taskStarted"
    :duration="5"
    :audioSrc="task.audio_guidance"
    :type="'test'"
    @countdown-finished="startTask"
  />
  <div v-else class="bg-gray-100 p-4 rounded-lg shadow-md">
    <p class="text-lg font-bold text-gray-800 mt-4">Task {{ task.type }}</p>
    <h2 class="text-lg font-bold text-gray-800 mt-4">
      {{ task.header }}
    </h2>
    <q-separator spaced class="my-2" />
    <MarkdownView :content="task.description" />
    <p class="text-gray-700 mt-2 text-base">{{ task.text }}</p>
  </div>
  <button @click="startReading">Start Reading</button>

  <MicrophoneFooterPrepare
    v-if="currentState === 'prepare' && taskStarted"
    :timeout="task.preparation_seconds"
    @prepare-completed="prepareStop"
  />
  <div v-else-if="currentState === 'record'">
    <Timer
      v-if="!recordStarted"
      :duration="5"
      :audioSrc="task.audio_guidance"
      :type="'test'"
      @countdown-finished="startRecord"
    />
    <MicrophoneFooterRecord
      v-else
      :timeout="task.execution_seconds"
      :taskId="task.id"
      @record-completed="recordStop"
    />
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
      currentState: 'prepare'
    }
  },
  methods: {
    startTask() {
      this.taskStarted = true
    },
    startRecord() {
      this.recordStarted = true
    },
    startReading() {
      this.$emit('next-task')
    },
    prepareStop() {
      this.currentState = 'record'
    },
    recordStop() {
      this.startReading()
    }
  },
  emits: ['next-task']
}
</script>
