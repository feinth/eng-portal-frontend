<template>
  <Timer
    v-if="showTimerPrepare"
    :duration="5"
    :audioSrc="task.audio_guidance"
    :type="'test'"
    @countdown-finished="startTask"
  />
  <Timer
    v-if="showTimerAnswer"
    :duration="5"
    :audioSrc="task.audio_before_execution"
    :type="'answer'"
    @countdown-finished="startRecord"
  />
  <div
    v-show="currentState === 'prepare' && taskStarted"
    class="bg-gray-100 p-4 rounded-lg shadow-md"
  >
    <div class="row q-col-gutter-lg">
      <div class="col-6">
        <p class="text-lg font-bold text-gray-800 mt-4">
          Task {{ task.type + ' Study the advertisement.' }}
        </p>
        <q-separator spaced class="my-2" />
        <MarkdownView :content="task.header" />
        <ul>
          <li v-for="(question, index) in task.questions" :key="index">
            {{ `${index + 1}) ` + question.description }}
          </li>
        </ul>
        <br />
        <MarkdownView
          :content="'**You have 20 seconds to ask each question.**'"
        />
      </div>

      <div class="col-6 text-gray-800 my-card">
        <q-item>
          <q-item-section>
            <MarkdownView :content="task.images[0].header" />
            <q-img :src="imgSrc + task.images[0].image" />
          </q-item-section>
        </q-item>
      </div>
    </div>
  </div>

  <MicrophoneFooterPrepare
    v-if="currentState === 'prepare' && taskStarted"
    :timeout="task.preparation_seconds"
    @prepare-completed="prepareStop"
  />
  <div v-else-if="currentState === 'record' && recordStarted">
    <div v-for="(question, index) in questions" :key="index">
      <div class="bg-gray-100 p-4 rounded-lg shadow-md">
        <div class="row q-col-gutter-lg">
          <div class="col-6">
            <p class="text-lg font-bold text-gray-800 mt-4">
              Task {{ task.type + ' Study the advertisement.' }}
            </p>
            <q-separator spaced class="my-2" />

            {{ `Question ${index}: ${question.description}` }}
          </div>

          <div class="col-6 text-gray-800 my-card">
            <q-item>
              <q-item-section>
                <MarkdownView :content="task.images[0].header" />
                <q-img :src="imgSrc + task.images[0].image" />
              </q-item-section>
            </q-item>
          </div>
        </div>
      </div>
      <MicrophoneFooterRecord
        :timeout="20"
        :taskId="task.id"
        :assignmentId="index"
        @record-completed="recordStop"
      />
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
      imgSrc: `http://localhost:80`,
      questions: this.task.questions
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
