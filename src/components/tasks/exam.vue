<template>
  <div>
    <!-- Отображение текущего задания -->
    <component
      :is="currentTaskComponent"
      :task="currentTask"
      @next-task="nextTask"
    ></component>
  </div>
</template>

<script>
import Task1 from './task-1.vue'
import Task2 from './task-2.vue'
import Task3 from './task-3.vue'
import Task4 from './task-4.vue'

export default {
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentTaskIndex: 0,
      recordings: [],
      mediaRecorder: null,
      audioChunks: []
    }
  },
  computed: {
    currentTask() {
      return this.tasks[this.currentTaskIndex]
    },
    currentTaskComponent() {
      switch (this.currentTask.type) {
        case 'Reading':
          return 'Task1'
        case 'StudyTheAdvertisement':
          return 'Task2'
        case 'Interview':
          return 'Task3'
        case 'Speaking':
          return 'Task4'
        default:
          return null
      }
    }
  },
  mounted() {
    this.startTask()
  },
  methods: {
    nextTask() {
      this.currentTaskIndex++
      if (this.currentTaskIndex < this.tasks.length) {
      } else {
        this.finishExam()
      }
    },
    finishExam() {}
  },
  components: {
    Task1,
    Task2,
    Task3,
    Task4
  }
}
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #f8f9fa;
  padding: 10px;
  text-align: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}
</style>
