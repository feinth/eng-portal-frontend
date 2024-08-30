<template>
  <div>
    <h2>{{ task.header }}</h2>
    <p>{{ task.text }}</p>
    <button @click="startReading">Start Reading</button>
  </div>
  <TaskFooter
    :timeout="timeout"
    :type="type"
    :task-id="taskId"
    :assignment-id="assignmentId"
    @taskCompleted="handleTaskCompleted"
  />
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
    startReading() {
      this.$emit('next-task')
    }
  }
}
</script>
