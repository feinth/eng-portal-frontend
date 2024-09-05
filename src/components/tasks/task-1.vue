<template>
  <Timer
    v-if="!taskStarted"
    :duration="5"
    :audioSrc="task.audioSrc"
    :type="'test'"
    @countdown-finished="startTask"
  />
  <div>
    <h2>{{ task.header }}</h2>
    <p>{{ task.text }}</p>
    <button @click="startReading">Start Reading</button>
  </div>
</template>

<script>
import Timer from '../utils/timer.vue'
export default {
  components: {
    Timer
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
    startReading() {
      this.$emit('next-task')
    }
  }
}
</script>
