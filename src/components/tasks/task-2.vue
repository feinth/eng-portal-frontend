<template>
  <div>
    <h2>{{ task.header }}</h2>
    <p>{{ task.description }}</p>
    <ul>
      <li v-for="(question, index) in task.questions" :key="index">
        {{ question }}
      </li>
    </ul>
    <button @click="finishTask">Finish Task</button>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  methods: {
    finishTask() {
      // Логика завершения задания
      this.$emit('next-task')
    }
  }
}
</script>
