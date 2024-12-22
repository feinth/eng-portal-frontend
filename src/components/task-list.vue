<template>
  <div class="tasks-list">
    <q-btn
      v-for="task in tasks"
      :key="task.id"
      :label="`Вариант ${task.number}`"
      color="teal-8"
      class="custom-task-button"
      @click="fetchTaskDetails(task.id)"
    />
  </div>
</template>

<script>
import { useExamStore } from '../stores/exam.store'
import { router } from '../router/router'
export default {
  name: 'TasksList',
  props: {
    tasks: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      examStore: useExamStore(),
      router: router
    }
  },
  methods: {
    fetchTaskDetails(id) {
      this.examStore.setExamId(id)
      this.router.push('/microphone-test')
    }
  }
}
</script>

<style scoped>
.tasks-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Два столбца */
  gap: 1rem; /* Расстояние между кнопками */
}
.custom-task-button {
  margin: 0.5rem; /* Отступы между кнопками */
  font-size: 1.25rem; /* Размер шрифта */
  color: #ffffff; /* Цвет текста */
}
</style>
