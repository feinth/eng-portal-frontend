<template>
  <Timer
    v-if="!taskStarted"
    :duration="5"
    :audioSrc="task.audio_guidance"
    :type="'test'"
    @countdown-finished="startTask"
  />
  <div v-else class="bg-gray-100 p-4 rounded-lg shadow-md">
    <div class="row q-col-gutter-lg">
      <!-- Left Side: Text and Questions Block -->
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
            <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />
          </q-item-section>
          <q-item-section> </q-item-section>
        </q-item>
      </div>
    </div>
  </div>
  <button @click="finishTask">Next Task</button>
</template>

<script>
import Timer from '../utils/timer.vue'
import MarkdownView from '../utils/markdown-view.vue'

export default {
  components: {
    Timer,
    MarkdownView
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      taskStarted: false
    }
  },
  methods: {
    startTask() {
      this.taskStarted = true
    },
    finishTask() {
      // Логика завершения задания
      this.$emit('next-task')
    }
  },
  emits: ['next-task']
}
</script>
<style>
.text-color-primary {
  color: #01695c;
}
.my-card {
  width: 100%;
  max-width: 450px;
  max-height: 450px;
}
</style>
