<template>
  <div v-if="beforeTaskTimer > 0" class="countdown-container flex flex-col items-center justify-center h-screen">
    <p class="mt-2 text-center">Be ready for the test</p>

    <p class="font-bold text-center">{{ beforeTaskTimer }}</p>

    <p class="mt-2 text-center">seconds</p>
  </div>
  <div v-else>
    <TaskFooter :task="prepareData" @stop="prepareStop" />
  </div>

</template>


<script>
import TaskFooter from './task-footer.vue'
export default {
  components: {
    TaskFooter
  },
  data() {
    return {
      prepareComplete: false,
      prepareTime: 0,
      prepareTimeout: 110, // Время подготовк в секундах
      beforeTaskTimer: 5,
    }
  },
  methods: {
    prepareStop() {
      this.$emit('prepare-finished');
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
      const item = {};
      item.timeLeft = this.prepareTime;
      item.timeout = this.prepareTimeout;
      item.type = 'prepare';
      return item;
    }
  },
  emits: ['prepareFinished'],
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
