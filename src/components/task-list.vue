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
      taskLoaded: false
    }
  },
  methods: {
    fetchTaskDetails(id) {
      this.examStore.getExamTasks(id).then((result) => {
        this.taskLoaded = true
        this.$emit('taskLoaded')
      })
    }
  }
}
</script>

<style scoped>
.tasks-list {
  display: flex;
  flex-wrap: wrap; /* Перенос кнопок на следующую строку */
  justify-content: center; /* Выравнивание кнопок по центру */
}
.custom-task-button {
  width: 200px; /* Ширина кнопок */
  margin: 0.5rem; /* Отступы между кнопками */
  font-size: 1.25rem; /* Размер шрифта */
  color: #ffffff; /* Цвет текста */
}
</style>
