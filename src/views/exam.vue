<template>
  <div v-if="examData && examData.tasks.length > 0">
    <!-- Отображение текущего задания -->
    <component
      :is="currentTaskComponent"
      :task="currentTask"
      @next-task="nextTask"
    />
  </div>
  <div v-else>
    <p>No exam data available or exam has no tasks.</p>
  </div>
</template>

<script>
import Task1 from '../components/tasks/task-1.vue'
import Task2 from '../components/tasks/task-2.vue'
import Task3 from '../components/tasks/task-3.vue'
import Task4 from '../components/tasks/task-4.vue'
import { useExamStore } from '../stores/exam.store'

export default {
  components: {
    Task1,
    Task2,
    Task3,
    Task4
  },
  data() {
    return {
      currentTaskIndex: 0,
      examData: null,
      examStore: useExamStore()
    }
  },
  computed: {
    currentTask() {
      return this.examData?.tasks[this.currentTaskIndex] || null
    },
    currentTaskComponent() {
      switch (this.currentTask?.type) {
        case 1:
          return 'Task1'
        case 2:
          return 'Task2'
        case 3:
          return 'Task3'
        case 4:
          return 'Task4'
        default:
          return null
      }
    }
  },
  methods: {
    startExam() {
      const examData = this.examStore.currentExam
      if (examData && examData.tasks && examData.tasks.length > 0) {
        this.examData = examData
      } else {
        console.error('No exam data available or exam has no tasks.')
      }
    },
    nextTask() {
      if (this.currentTaskIndex < this.examData.tasks.length - 1) {
        this.currentTaskIndex++
      } else {
        this.finishExam()
      }
    },
    finishExam() {
      console.log('Exam finished')
    }
  },
  mounted() {
    this.startExam()
  }
}
</script>

<style scoped></style>
