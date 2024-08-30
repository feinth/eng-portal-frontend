<template>
  <div>
    <h2>{{ task.header }}</h2>
    <ul>
      <li v-for="(question, index) in task.questions" :key="index">
        {{ question }}
      </li>
    </ul>
    <button @click="finishInterview">Finish Interview</button>
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
    finishInterview() {
      // Логика завершения интервью
      this.$emit('next-task')
    }
  }
}
</script>
