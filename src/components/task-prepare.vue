<template>
  <div
    v-if="beforeTaskTimer > 0"
    class="countdown-container flex flex-col items-center justify-center h-screen"
  >
    <p class="mt-2 text-center">Be ready for the test</p>

    <p class="font-bold text-center">{{ beforeTaskTimer }}</p>

    <p class="mt-2 text-center">seconds</p>
  </div>
  <div v-else>
    <div class="p-4">
      <TaskView :task="task" />
    </div>
    <TaskFooter
      :timeout="task.prepareTimeout"
      type="prepare"
      @stop="prepareStop"
    />
  </div>
</template>

<script>
import TaskFooter from './task-footer.vue'
import TaskView from './task-view.vue'
export default {
  components: {
    TaskFooter,
    TaskView
  },
  data() {
    return {
      prepareComplete: false,
      prepareTime: 0,
      beforeTaskTimer: 5
    }
  },
  methods: {
    prepareStop() {
      this.$emit('prepare-finished')
    }
  },
  props: {
    task: {
      type: Object,
      required: false
    }
  },
  computed: {
    prepareData() {
      const item = {}
      item.timeout = this.task.prepareTimeout
      item.type = 'prepare'
      return item
    }
  },
  emits: ['prepare-finished'],
  mounted() {
    setInterval(() => {
      if (this.beforeTaskTimer > 0) {
        this.beforeTaskTimer--
      }
    }, 1000)
  }
}
</script>

<style>
.countdown-container {
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 3rem;
}
</style>
