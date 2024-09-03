<template>
  <div class="tasks-list">
    <q-btn
      v-for="task in tasks"
      :key="task.idTask"
      :label="task.NameTask"
      color="teal-8"
      class="custom-task-button"
      @click="fetchTaskDetails(task.idTask)"
    />
  </div>
</template>

<script>
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
      taskLoaded: false
    }
  },
  methods: {
    fetchTaskDetails(idTask) {
      // Здесь можно добавить логику для запроса детальной информации о задании по его idTask
      console.log('Fetching details for task with id:', idTask)
      this.taskLoaded = true
      this.$emit('taskLoaded')
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
