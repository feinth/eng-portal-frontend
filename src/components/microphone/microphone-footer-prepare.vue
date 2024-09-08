<template>
  <div class="fixed bottom-0 left-0 w-full border border-gray-300">
    <q-toolbar>
      <!-- иконка -->
      <div class="flex items-center">
        <div class="mr-4 flex items-center">
          <q-btn
            color="blue"
            icon="sym_o_mic"
            label="Preparation"
            no-caps
            class="w-32"
          />
        </div>
      </div>

      <div class="flex-grow flex items-center justify-center">
        <q-linear-progress
          stripe
          class="q-my-md"
          size="25px"
          :value="timeLeft / timeout"
          :max="100"
          color="blue"
        >
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="black" :label="countdown" />
          </div>
        </q-linear-progress>
      </div>
      <!-- прогресс -->
      <div class="flex items-center ml-4">
        <q-btn
          color="blue"
          @click="stopPrepare"
          label="Завершить"
          no-caps
          class="w-32"
        />
      </div>
    </q-toolbar>
  </div>
</template>

<script>
export default {
  props: {
    timeout: {
      type: Number,
      required: true,
      default: 60
    }
  },
  data() {
    return {
      timeLeft: 0,
      timer: null
    }
  },
  computed: {
    countdown() {
      const remainingSeconds = this.timeout - this.timeLeft
      const minutes = Math.floor(remainingSeconds / 60)
      const seconds = remainingSeconds % 60
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }
  },
  methods: {
    startPrepare() {
      this.timeLeft = 0

      this.timer = setInterval(() => {
        this.timeLeft += 1
        if (this.timeLeft >= this.timeout) {
          this.stopPrepare()
        }
      }, 1000)
    },
    stopPrepare() {
      clearInterval(this.timer)
      this.completeTask()
    },
    completeTask() {
      this.$emit('prepare-completed')
    }
  },
  mounted() {
    this.startPrepare()
  }
}
</script>

<style scoped>
.text-teal-700 {
  color: #285e61;
}

.text-teal-900 {
  color: #1c3d45;
}

.text-gray-800 {
  color: #2d3748;
}

.list-disc {
  list-style-type: disc;
}

.list-inside {
  list-style-position: inside;
}

.h-full {
  height: 100%;
}

.flex-grow {
  flex-grow: 1;
}
</style>
